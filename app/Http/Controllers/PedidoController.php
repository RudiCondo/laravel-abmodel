<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\DetallePedido;
use App\Models\Carrito;
use App\Models\DetalleCarrito;
use JWTAuth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PedidoController extends Controller
{
    /**
     * Listar todos los pedidos del usuario logueado
     */
    public function index()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $pedidos = Pedido::with('detalles.producto', 'detalles.tienda')
                ->where('id_usuario', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $pedidos
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Mostrar detalle de un pedido
     */
    public function show($id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $pedido = Pedido::with('detalles.producto', 'detalles.tienda')
                ->find($id);

            if (!$pedido) {
                return response()->json(['success' => false, 'message' => 'Pedido no encontrado'], 404);
            }

            // Solo el dueño del pedido puede verlo
            if ($pedido->id_usuario != $user->id) {
                return response()->json(['success' => false, 'message' => 'No tienes permiso'], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $pedido
            ]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Crear un pedido desde el carrito
     */
    public function store()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            // Obtener carrito del usuario
            $carrito = Carrito::with('detalles.producto')->where('id_usuario', $user->id)->first();
            if (!$carrito || $carrito->detalles->isEmpty()) {
                return response()->json(['success' => false, 'message' => 'El carrito está vacío'], 400);
            }

            DB::beginTransaction();

            // Calcular total general
            $total = $carrito->detalles->sum(function ($detalle) {
                return $detalle->cantidad * $detalle->producto->precio;
            });

            // Crear pedido principal
            $pedido = Pedido::create([
                'id_usuario' => $user->id,
                'estado' => 'pendiente',
                'metodo_pago' => 'pendiente',
                'total' => $total
            ]);

            // Crear detalles de pedido (sub-órdenes por tienda)
            foreach ($carrito->detalles as $detalleCarrito) {
                DetallePedido::create([
                    'id_pedido' => $pedido->id_pedido,
                    'id_producto' => $detalleCarrito->id_producto,
                    'id_tienda' => $detalleCarrito->producto->id_tienda,
                    'cantidad' => $detalleCarrito->cantidad,
                    'precio_unitario' => $detalleCarrito->producto->precio
                ]);
            }

            // Limpiar carrito
            $carrito->detalles()->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pedido creado correctamente',
                'data' => $pedido->load('detalles.producto', 'detalles.tienda')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualizar estado del pedido (solo dueño o tienda)
     */
    public function actualizarEstado(Request $request, $id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $pedido = Pedido::with('detalles')->find($id);
            if (!$pedido) {
                return response()->json(['success' => false, 'message' => 'Pedido no encontrado'], 404);
            }

            $validator = Validator::make($request->all(), [
                'estado' => 'required|in:pendiente,confirmado,pago_acordado,en_camino,entregado,cancelado'
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            // Validar permisos
            $esDueño = $pedido->id_usuario == $user->id;
            $esTienda = $pedido->detalles->pluck('id_tienda')->contains(function ($idTienda) use ($user) {
                return $user->tienda && $user->tienda->id_tienda == $idTienda;
            });

            if (!$esDueño && !$esTienda) {
                return response()->json(['success' => false, 'message' => 'No tienes permiso para actualizar este pedido'], 403);
            }

            $pedido->estado = $request->estado;
            $pedido->save();

            return response()->json([
                'success' => true,
                'message' => 'Estado actualizado',
                'data' => $pedido
            ]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Cancelar pedido (solo dueño)
     */
    public function cancelarPedido($id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $pedido = Pedido::find($id);
            if (!$pedido) {
                return response()->json(['success' => false, 'message' => 'Pedido no encontrado'], 404);
            }

            if ($pedido->id_usuario != $user->id) {
                return response()->json(['success' => false, 'message' => 'No tienes permiso para cancelar este pedido'], 403);
            }

            // Solo cancelar si aún no está entregado
            if (in_array($pedido->estado, ['entregado'])) {
                return response()->json(['success' => false, 'message' => 'No se puede cancelar un pedido ya entregado'], 400);
            }

            $pedido->estado = 'cancelado';
            $pedido->save();

            return response()->json([
                'success' => true,
                'message' => 'Pedido cancelado',
                'data' => $pedido
            ]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
