<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Aquí defines las rutas web de tu aplicación.
| Todas están dentro del grupo de middleware "web".
|--------------------------------------------------------------------------
*/

// 🏠 Pantalla principal pública
Route::view('/', 'pages.home');

// 🛍 Tiendas
Route::view('/tiendas', 'pages.tiendas');

// 🧴 Productos
Route::view('/productos', 'pages.productos');

// 🗂 Categorías
Route::view('/categorias', 'pages.categorias');

// 👤 Perfil del usuario
Route::view('/perfil', 'pages.perfil');

// 🔐 Login (corregido con nombre)
Route::view('/login', 'pages.login')->name('login');

// 🌸 Pantalla cliente (protegida por frontend con JWT)
Route::view('/cliente/dashboard', 'pages.cliente');

// 🧿 Pantalla emprendedor (también protegida por frontend con JWT)
Route::view('/emprendedor/dashboard', 'pages.emprendedor');

Route::get('productos/mis', [ProductoController::class, 'misProductos']);

