<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Gemini\Laravel\Facades\Gemini;

class ChatController extends Controller
{
    //
    public function responder(Request $request)
    {
        $mensaje = $request->input('mensaje', 'Hola, ¿qué tal?');

        $resultado = Gemini::generativeModel('gemini-2.0-flash')
            ->generateContent($mensaje);

        return response()->json([
            'input' => $mensaje,
            'respuesta' => $resultado->text(),
        ]);
    }
}
