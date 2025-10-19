<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comentario;
use App\Models\Producto;
use JWTAuth;
use Illuminate\Support\Facades\Validator;

class ComentarioController extends Controller
{
    //Listar comentarios, opcionalmente por producto o tienda
     
    public function index(Request $request)
    {
        $query = Comentario::with(['usuario', 'producto', 'tienda']);

        if ($request->has('id_producto')) {
            $query->where('id_producto', $request->id_producto);
        }

        if ($request->has('id_tienda')) {
            $query->where('id_tienda', $request->id_tienda);
        }

        $comentarios = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $comentarios
        ]);
    }

    /**
     * Mostrar un comentario específico
     */
    public function show($id)
    {
        $comentario = Comentario::with(['usuario', 'producto', 'tienda'])->find($id);

        if (!$comentario) {
            return response()->json(['success' => false, 'message' => 'Comentario no encontrado'], 404);
        }

        return response()->json(['success' => true, 'data' => $comentario]);
    }

    /**
     * Crear un comentario (usuario autenticado)
     */
    public function store(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $validator = Validator::make($request->all(), [
                'id_producto' => 'required|exists:productos,id_producto',
                'calificacion' => 'required|integer|min:1|max:5',
                'comentario' => 'required|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $producto = Producto::find($request->id_producto);

            $comentario = Comentario::create([
                'id_usuario' => $user->id,
                'id_producto' => $producto->id_producto,
                'id_tienda' => $producto->id_tienda,
                'calificacion' => $request->calificacion,
                'comentario' => $request->comentario,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Comentario creado correctamente',
                'data' => $comentario->load(['usuario', 'producto', 'tienda'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error al crear comentario', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualizar comentario (solo dueño)
     */
    public function update(Request $request, $id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $comentario = Comentario::find($id);
            if (!$comentario) return response()->json(['success' => false, 'message' => 'Comentario no encontrado'], 404);
            if ($comentario->id_usuario != $user->id) return response()->json(['success' => false, 'message' => 'No tienes permiso'], 403);

            $validator = Validator::make($request->all(), [
                'calificacion' => 'sometimes|integer|min:1|max:5',
                'comentario' => 'sometimes|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $comentario->update($request->only(['calificacion', 'comentario']));

            return response()->json([
                'success' => true,
                'message' => 'Comentario actualizado correctamente',
                'data' => $comentario
            ]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Eliminar comentario (dueño o admin)
     */
    public function destroy($id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $comentario = Comentario::find($id);
            if (!$comentario) return response()->json(['success' => false, 'message' => 'Comentario no encontrado'], 404);

            // Solo dueño o admin puede eliminar
            if ($comentario->id_usuario != $user->id && $user->rol != 'admin') {
                return response()->json(['success' => false, 'message' => 'No tienes permiso'], 403);
            }

            $comentario->delete();

            return response()->json(['success' => true, 'message' => 'Comentario eliminado correctamente']);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
