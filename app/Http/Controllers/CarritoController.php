<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrito;
use App\Models\DetalleCarrito;
use App\Models\Producto;
use JWTAuth;
use Illuminate\Support\Facades\Validator;



class CarritoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Obtener el carrito del usuario
            try {
            $user = JWTAuth::parseToken()->authenticate();
            $carrito = Carrito::with('detalles.producto')
                ->where('id_usuario', $user->id)
                ->first();

            if (!$carrito) {
                return response()->json([
                    'success' => true,
                    'data' => null,
                    'message' => 'No hay carrito creado'
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $carrito
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Crear carrito si no existe
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $carrito = Carrito::firstOrCreate(
                ['id_usuario' => $user->id]
            );

            return response()->json([
                'success' => true,
                'message' => 'Carrito creado',
                'data' => $carrito
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
        // Agregar producto al carrito
    public function agregarProducto(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $validator = Validator::make($request->all(), [
                'id_producto' => 'required|exists:productos,id_producto',
                'cantidad' => 'required|integer|min:1'
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $carrito = Carrito::firstOrCreate(['id_usuario' => $user->id]);

            $detalle = DetalleCarrito::updateOrCreate(
                ['id_carrito' => $carrito->id_carrito, 'id_producto' => $request->id_producto],
                ['cantidad' => $request->cantidad]
            );

            return response()->json([
                'success' => true,
                'message' => 'Producto agregado al carrito',
                'data' => $detalle
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
        // Modificar cantidad de un producto
    public function actualizarDetalle(Request $request, $id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $detalle = DetalleCarrito::find($id);
            if (!$detalle) {
                return response()->json(['success' => false, 'message' => 'Detalle no encontrado'], 404);
            }

            $carrito = Carrito::where('id_carrito', $detalle->id_carrito)
                ->where('id_usuario', $user->id)
                ->first();

            if (!$carrito) {
                return response()->json(['success' => false, 'message' => 'No tienes permiso'], 403);
            }

            $validator = Validator::make($request->all(), [
                'cantidad' => 'required|integer|min:1'
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $detalle->cantidad = $request->cantidad;
            $detalle->save();

            return response()->json(['success' => true, 'message' => 'Cantidad actualizada', 'data' => $detalle]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
        public function eliminarDetalle($id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $detalle = DetalleCarrito::find($id);
            if (!$detalle) {
                return response()->json(['success' => false, 'message' => 'Detalle no encontrado'], 404);
            }

            $carrito = Carrito::where('id_carrito', $detalle->id_carrito)
                ->where('id_usuario', $user->id)
                ->first();

            if (!$carrito) {
                return response()->json(['success' => false, 'message' => 'No tienes permiso'], 403);
            }

            $detalle->delete();

            return response()->json(['success' => true, 'message' => 'Producto eliminado del carrito']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
