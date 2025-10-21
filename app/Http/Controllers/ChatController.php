<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Gemini\Laravel\Facades\Gemini;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Comentario;
use App\Models\Tienda;

class ChatController extends Controller
{
    /**
     * Responde mensajes del cliente usando Gemini con contexto del marketplace.
     */
    public function responder(Request $request)
    {
        try {
            // 🔒 Verificar autenticación
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token inválido o usuario no autenticado.'
                ], 401);
            }

            if ($user->rol !== 'cliente') {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo los usuarios con rol cliente pueden usar el chatbot.'
                ], 403);
            }

            $mensaje = trim($request->input('mensaje'));

            if (!$mensaje) {
                return response()->json([
                    'success' => false,
                    'message' => 'Debe enviar un mensaje para procesar.'
                ], 400);
            }

            // 🧩 Cargar contexto de productos (solo los más relevantes)
            $productos = Producto::with(['categoria', 'tienda', 'comentarios.usuario'])
                ->orderByDesc('created_at')
                ->limit(15)
                ->get()
                ->map(function ($p) {
                    return [
                        'nombre' => $p->nombre_producto,
                        'categoria' => $p->categoria->nombre_categoria ?? 'Sin categoría',
                        'precio' => $p->precio,
                        'stock' => $p->stock,
                        'tienda' => $p->tienda->nombre_tienda ?? 'Sin tienda',
                        'descripcion' => $p->descripcion,
                        'reseñas' => $p->comentarios->map(function ($c) {
                            return [
                                'usuario' => $c->usuario->name ?? 'Anónimo',
                                'calificacion' => $c->calificacion,
                                'comentario' => $c->comentario,
                            ];
                        }),
                    ];
                });

            // 💬 Contexto del modelo Gemini
            $contexto = "
Eres un asistente virtual experto en cosméticos del marketplace ABModel.
Tu objetivo es ayudar a los clientes a elegir productos, responder preguntas y dar recomendaciones personalizadas.
Usa los siguientes datos reales del catálogo para responder.

PRODUCTOS DISPONIBLES:
" . json_encode($productos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "

REGLAS:
- Si el usuario pregunta por precios, ingredientes, stock o reseñas, usa la información disponible.
- Si pregunta qué producto le conviene (por tipo de piel, tono, etc.), recomienda opciones concretas.
- No inventes productos ni precios.
- Si no encuentras una respuesta exacta, ofrece sugerencias útiles con base en los datos.
- Responde siempre en español, de manera amable, natural y breve.
";

            // 🧠 Generar respuesta desde Gemini
            $respuestaGemini = Gemini::generativeModel('gemini-2.0-flash')
                ->generateContent([
                    ['role' => 'system', 'parts' => [$contexto]],
                    ['role' => 'user', 'parts' => [$mensaje]],
                ]);

            $respuestaTexto = $respuestaGemini->text() ?? 'Lo siento, no pude procesar tu consulta en este momento.';

            return response()->json([
                'success' => true,
                'user' => $user->name,
                'input' => $mensaje,
                'respuesta' => $respuestaTexto,
            ]);

        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token inválido o expirado.',
                'error' => $e->getMessage(),
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el mensaje.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
