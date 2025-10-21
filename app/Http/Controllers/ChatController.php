<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Gemini\Laravel\Facades\Gemini;
use Tymon\JWTAuth\Facades\JWTAuth;


class ChatController extends Controller
{
    //
    public function responder(Request $request)
    {
        try {
            // Obtener usuario autenticado desde el token
            $user = JWTAuth::parseToken()->authenticate();

            // Verificar si el rol es 'cliente'
            if ($user->rol !== 'cliente') {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo los usuarios con rol cliente pueden usar el chatbot.'
                ], 403);
            }

            // Obtener mensaje del cliente
            $mensaje = $request->input('mensaje', 'Hola, ¿qué tal?');

            // Generar respuesta con Gemini
            $resultado = Gemini::generativeModel('gemini-2.0-flash')
                ->generateContent($mensaje);

            return response()->json([
                'success' => true,
                'input' => $mensaje,
                'respuesta' => $resultado->text(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el mensaje o token inválido.',
                'error' => $e->getMessage()
            ], 401);
        }
    }
}
