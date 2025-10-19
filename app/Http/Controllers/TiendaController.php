<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tienda;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use JWTAuth;

class TiendaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // listar todas las tiendas
        $tiendas = Tienda::with('usuario')->get();
        return response()->json($tiendas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Crear una nueva tienda
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $validator = Validator::make($request->all(), [
                'nombre_tienda' => 'required|string|max:100',
                'descripcion' => 'nullable|string',
                'logo_url' => 'nullable|url',
                'estado' => 'in:activo,inactivo'
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            if ($user->rol !== 'emprendedor') {
                return response()->json(['error' => 'Solo los emprendedores pueden crear tiendas'], 403);
            }

            if (Tienda::where('id_usuario', $user->id)->exists()) {
                return response()->json(['error' => 'Ya tienes una tienda registrada'], 400);
            }

            $tienda = Tienda::create([
                'id_usuario' => $user->id,
                'nombre_tienda' => $request->nombre_tienda,
                'descripcion' => $request->descripcion,
                'logo_url' => $request->logo_url,
                'estado' => $request->estado ?? 'activo',
            ]);

            return response()->json($tienda, 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Token inválido o no enviado'], 401);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //muestra tienda por id especifica
        $tienda = Tienda::with('usuario', 'productos')->find($id);

        if (!$tienda) {
            return response()->json(['error' => 'Tienda no encontrada'], 404);
        }

        return response()->json($tienda);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //Actualizar tienda
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $tienda = Tienda::find($id);

            if (!$tienda) return response()->json(['error' => 'Tienda no encontrada'], 404);
            if ($tienda->id_usuario != $user->id) return response()->json(['error' => 'No tienes permisos'], 403);

            $validator = Validator::make($request->all(), [
                'nombre_tienda' => 'sometimes|required|string|max:100',
                'descripcion' => 'nullable|string',
                'logo_url' => 'nullable|url',
                'estado' => 'in:activo,inactivo'
            ]);

            if ($validator->fails()) return response()->json($validator->errors(), 422);

            $tienda->update($request->all());

            return response()->json($tienda);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Token inválido o no enviado'], 401);
        }
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //eliminar tienda
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $tienda = Tienda::find($id);

            if (!$tienda) return response()->json(['error' => 'Tienda no encontrada'], 404);
            if ($tienda->id_usuario != $user->id) return response()->json(['error' => 'No tienes permisos'], 403);

            $tienda->delete();

            return response()->json(['message' => 'Tienda eliminada correctamente']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Token inválido o no enviado'], 401);
        }
    }
}
