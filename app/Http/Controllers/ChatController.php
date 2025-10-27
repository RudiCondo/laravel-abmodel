<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Gemini\Laravel\Facades\Gemini;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Comentario;
use App\Models\Tienda;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function responder(Request $request)
    {
        try {
            // 1️⃣ Obtener usuario autenticado
            $user = JWTAuth::parseToken()->authenticate();

            if ($user->rol !== 'cliente') {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo los usuarios con rol cliente pueden usar el chatbot.'
                ], 403);
            }

            // 2️⃣ Obtener y limpiar el mensaje del cliente
            $mensaje = strtolower($request->input('mensaje', 'Hola, ¿qué tal?'));
            $mensaje = preg_replace('/[^\p{L}\p{N}\s]/u', '', $mensaje); // quitar signos y tildes raros
            $palabras = preg_split('/\s+/', $mensaje);

            // 3️⃣ Buscar productos que coincidan por nombre, descripción o categoría
            $productos = Producto::with('tienda', 'categoria')
                ->where(function($query) use ($palabras) {
                    foreach ($palabras as $palabra) {
                        $raiz = rtrim($palabra, 's'); // para que "perfumes" encuentre "perfume"
                        $query->orWhereRaw('LOWER(nombre_producto) LIKE ?', ["%$raiz%"])
                              ->orWhereRaw('LOWER(descripcion) LIKE ?', ["%$raiz%"])
                              ->orWhereHas('categoria', function ($sub) use ($raiz) {
                                  $sub->whereRaw('LOWER(nombre_categoria) LIKE ?', ["%$raiz%"])
                                      ->orWhereRaw('LOWER(descripcion) LIKE ?', ["%$raiz%"]);
                              });
                    }
                })
                ->take(5)
                ->get(['id_producto','nombre_producto','descripcion','precio','stock','imagen_url','id_tienda','id_categoria']);

            // 4️⃣ Crear el contexto para Gemini
            if ($productos->isEmpty()) {
                $contexto = "No se encontraron productos que coincidan con la búsqueda.";
            } else {
                $contexto = "Estos son algunos productos del inventario:\n\n";
                foreach ($productos as $p) {
                    $contexto .= "- {$p->nombre_producto}: {$p->descripcion} (Bs. {$p->precio})";
                    if ($p->stock <= 0) $contexto .= " [Agotado]";
                    $contexto .= "\n";
                }
            }

            // 5️⃣ Preparar el prompt inteligente
            $prompt = "
Eres un asistente virtual experto en belleza y cosméticos.
Usa solo la información del siguiente inventario para responder de forma útil, amable y concisa.

Inventario:
$contexto

Mensaje del cliente:
$mensaje
";

            // 6️⃣ Generar respuesta con Gemini
            $resultado = Gemini::generativeModel('gemini-2.0-flash')
                ->generateContent($prompt);

            // 7️⃣ Responder al frontend
            return response()->json([
                'success' => true,
                'input' => $mensaje,
                'respuesta' => $resultado->text(),
                'productos_usados' => $productos
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
