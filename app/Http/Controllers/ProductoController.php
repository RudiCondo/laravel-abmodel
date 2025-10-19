<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Tienda;
use Illuminate\Support\Facades\Validator;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //Listar todos los productos (con filtros opcionales)
        $query = Producto::with(['tienda', 'categoria']);

        // Filtros opcionales
        if ($request->has('id_tienda')) {
            $query->where('id_tienda', $request->id_tienda);
        }

        if ($request->has('id_categoria')) {
            $query->where('id_categoria', $request->id_categoria);
        }

        if ($request->has('nombre')) {
            $query->where('nombre_producto', 'like', '%' . $request->nombre . '%');
        }

        $productos = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $productos
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Crear un nuevo producto (solo usuarios autenticados con tienda)
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $validator = Validator::make($request->all(), [
                'id_categoria'     => 'required|exists:categorias,id_categoria',
                'nombre_producto'  => 'required|string|max:255',
                'descripcion'      => 'nullable|string',
                'precio'           => 'required|numeric|min:0',
                'stock'            => 'required|integer|min:0',
                'imagen_url'       => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Buscar la tienda del usuario autenticado
            $tienda = Tienda::where('id_usuario', $user->id)->first();

            if (!$tienda) {
                return response()->json([
                    'success' => false,
                    'message' => 'El usuario no tiene una tienda registrada'
                ], 403);
            }

            $producto = Producto::create([
                'id_tienda'       => $tienda->id_tienda,
                'id_categoria'    => $request->id_categoria,
                'nombre_producto' => $request->nombre_producto,
                'descripcion'     => $request->descripcion,
                'precio'          => $request->precio,
                'stock'           => $request->stock,
                'imagen_url'      => $request->imagen_url,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Producto creado exitosamente',
                'data' => $producto
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //Mostrar un producto específico
        $producto = Producto::with(['tienda', 'categoria'])->find($id);

        if (!$producto) {
            return response()->json(['success' => false, 'message' => 'Producto no encontrado'], 404);
        }

        return response()->json(['success' => true, 'data' => $producto]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //Actualizar un producto existente
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $producto = Producto::find($id);

            if (!$producto) {
                return response()->json([
                    'success' => false,
                    'message' => 'Producto no encontrado'
                ], 404);
            }

            // Verificar que el producto pertenece a la tienda del usuario
            $tienda = Tienda::where('id_usuario', $user->id)->first();

            if (!$tienda || $producto->id_tienda != $tienda->id_tienda) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para modificar este producto'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'id_categoria'     => 'sometimes|exists:categorias,id_categoria',
                'nombre_producto'  => 'sometimes|string|max:255',
                'descripcion'      => 'nullable|string',
                'precio'           => 'sometimes|numeric|min:0',
                'stock'            => 'sometimes|integer|min:0',
                'imagen_url'       => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $producto->update($request->only([
                'id_categoria', 'nombre_producto', 'descripcion', 'precio', 'stock', 'imagen_url'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado correctamente',
                'data' => $producto
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //Eliminar un producto
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $producto = Producto::find($id);

            if (!$producto) {
                return response()->json([
                    'success' => false,
                    'message' => 'Producto no encontrado'
                ], 404);
            }

            // Verificar propiedad de la tienda
            $tienda = Tienda::where('id_usuario', $user->id)->first();

            if (!$tienda || $producto->id_tienda != $tienda->id_tienda) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para eliminar este producto'
                ], 403);
            }

            $producto->delete();

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado correctamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
