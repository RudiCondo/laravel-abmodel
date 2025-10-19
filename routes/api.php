<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TiendaController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ComentarioController;

// ----------------- Usuarios/Clientes/Emprendedores ----------------------
//Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// Rutas protegidas (todas usando auth:api con driver JWT)
Route::middleware('auth:api')->group(function () {
    Route::get('profile', [AuthController::class, 'profile']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
});
// ---------------------- TIENDAS ----------------------
Route::get('tiendas', [TiendaController::class, 'index']); // Listar tiendas
Route::get('tiendas/{id}', [TiendaController::class, 'show']); // Detalle tienda
Route::middleware('auth:api')->group(function () {
    Route::post('tiendas', [TiendaController::class, 'store']); // Crear tienda
    Route::put('tiendas/{id}', [TiendaController::class, 'update']); // Actualizar tienda
    Route::delete('tiendas/{id}', [TiendaController::class, 'destroy']); // Eliminar tienda
});
// ---------------------- CATEGORIAS ----------------------
Route::get('categorias', [CategoriaController::class, 'index']);
Route::get('categorias/{id}', [CategoriaController::class, 'show']);
Route::middleware('auth:api')->group(function () {
    Route::post('categorias', [CategoriaController::class, 'store']);
    Route::put('categorias/{id}', [CategoriaController::class, 'update']);
    Route::delete('categorias/{id}', [CategoriaController::class, 'destroy']);
});
// ---------------------- PRODUCTOS ----------------------
Route::get('productos', [ProductoController::class, 'index']);
Route::get('productos/{id}', [ProductoController::class, 'show']);
Route::middleware('auth:api')->group(function () {
    Route::post('productos', [ProductoController::class, 'store']);
    Route::put('productos/{id}', [ProductoController::class, 'update']);
    Route::delete('productos/{id}', [ProductoController::class, 'destroy']);
});
// ---------------------- CARRITO ----------------------
Route::middleware('auth:api')->group(function () {
    Route::get('carrito', [CarritoController::class, 'index']);
    Route::post('carrito', [CarritoController::class, 'store']);
    Route::post('carrito/detalle', [CarritoController::class, 'agregarProducto']);
    Route::put('carrito/detalle/{id}', [CarritoController::class, 'actualizarDetalle']);
    Route::delete('carrito/detalle/{id}', [CarritoController::class, 'eliminarDetalle']);
});
// ---------------------- PEDIDOS ----------------------
Route::middleware('auth:api')->group(function () {
    // Pedidos del cliente
    Route::get('pedidos', [PedidoController::class, 'index']); // Listar todos los pedidos del usuario
    Route::get('pedidos/{id}', [PedidoController::class, 'show']); // Detalle de un pedido
    Route::post('pedidos', [PedidoController::class, 'store']); // Crear pedido desde carrito
    // Actualizar estado (solo si eres dueño o tienda correspondiente)
    Route::put('pedidos/{id}/estado', [PedidoController::class, 'actualizarEstado']); 
    // Cancelar pedido
    Route::delete('pedidos/{id}', [PedidoController::class, 'cancelarPedido']);
});
// ---------------------- COMENTARIOS ----------------------
Route::middleware('jwt.auth')->group(function () {
    Route::post('/comentarios', [ComentarioController::class, 'store']);
    Route::put('/comentarios/{id}', [ComentarioController::class, 'update']);
    Route::delete('/comentarios/{id}', [ComentarioController::class, 'destroy']);
});
// Rutas públicas
Route::get('/comentarios', [ComentarioController::class, 'index']);
Route::get('/comentarios/{id}', [ComentarioController::class, 'show']);
// Opcionales por producto/tienda
Route::get('/productos/{id}/comentarios', [ComentarioController::class, 'index']);
Route::get('/tiendas/{id}/comentarios', [ComentarioController::class, 'index']);