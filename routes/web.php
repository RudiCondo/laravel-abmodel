<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
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

// 🌸 Pantalla cliente
Route::view('/cliente/dashboard', 'pages.cliente');

// 🧿 Pantalla emprendedor
Route::view('/emprendedor/dashboard', 'pages.emprendedor');

// Agrega esta línea en tus rutas:
Route::post('/logout', function () {
    Auth::logout();
    return redirect('/');
})->name('logout');

