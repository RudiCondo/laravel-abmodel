<!DOCTYPE html>
<html lang="es">
  <head>
    @include('layouts._partials.head')
    @vite(['resources/css/style.css', 'resources/js/modal-auth.js'])
  </head>

  <body>
    {{-- CONDICIÓN PARA HEADER CLIENTE --}}
    @if($esCliente ?? false)
      @include('layouts._partials.header-cliente')
    @else
      @include('layouts._partials.header')
    @endif

    <main>
      @yield('content')
    </main>

    @include('layouts._partials.footer')

    @guest
      @include('layouts._partials.modal-auth')
    @endguest
  </body>
</html>