@php $esPublica = false; @endphp
@extends('layouts.app')

@section('title', 'Explora productos')

@section('content')
<section class="pantalla-productos">
  <h1 id="saludo-cliente">🌸 Bienvenida, cliente</h1>
  <p>Explora productos disponibles y agrégalos a tu carrito ceremonial.</p>

  <div id="grid-productos" class="grid-productos"></div>
</section>
@endsection

@vite(['resources/js/productos.js'])
