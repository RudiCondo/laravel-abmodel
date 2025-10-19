<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categoria;
use Tymon\JWTAuth\Facades\JWTAuth;
use Exception;

class CategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() //listar todas las categorias, publico
    {
        //
        try {
            $categorias = Categoria::all();
            return response()->json([
                'success' => true,
                'data' => $categorias
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las categorías',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) //Crear una nueva categoría (solo usuarios autenticados, idealmente admin)
    {
        //
        try {
            $user = JWTAuth::parseToken()->authenticate();

            // Solo admin (si tu modelo de User tiene rol)
            if ($user->rol !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para crear categorías'
                ], 403);
            }

            $request->validate([
                'nombre_categoria' => 'required|string|max:255',
                'descripcion' => 'nullable|string'
            ]);

            $categoria = Categoria::create([
                'nombre_categoria' => $request->nombre_categoria,
                'descripcion' => $request->descripcion
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Categoría creada correctamente',
                'data' => $categoria
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la categoría',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) //Mostrar una categoría por ID (público)
    {
        //
        try {
            $categoria = Categoria::where('id_categoria', $id)->first();

            if (!$categoria) {
                return response()->json([
                    'success' => false,
                    'message' => 'Categoría no encontrada'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $categoria
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la categoría',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id) //Actualizar categoría (solo admin)
    {
        //
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if ($user->rol !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para actualizar categorías'
                ], 403);
            }

            $categoria = Categoria::where('id_categoria', $id)->first();

            if (!$categoria) {
                return response()->json([
                    'success' => false,
                    'message' => 'Categoría no encontrada'
                ], 404);
            }

            $categoria->update($request->only(['nombre_categoria', 'descripcion']));

            return response()->json([
                'success' => true,
                'message' => 'Categoría actualizada correctamente',
                'data' => $categoria
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la categoría',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) //Eliminar categoría (solo admin)

    {
        //
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if ($user->rol !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para eliminar categorías'
                ], 403);
            }

            $categoria = Categoria::where('id_categoria', $id)->first();

            if (!$categoria) {
                return response()->json([
                    'success' => false,
                    'message' => 'Categoría no encontrada'
                ], 404);
            }

            $categoria->delete();

            return response()->json([
                'success' => true,
                'message' => 'Categoría eliminada correctamente'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la categoría',
                'error' => $e->getMessage()
            ], 500);
        }
    
    }
}
