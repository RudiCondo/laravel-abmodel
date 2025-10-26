<!DOCTYPE html>
<html lang="es">
  <head>
    @include('layouts._partials.head')
    
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
 
  @vite(['resources/js/modal-auth.js'])
  </head>

  <body>
    @include('layouts._partials.header')
   

    <main>
      @yield('content')
    </main>

    @include('layouts._partials.footer')

    @guest
      @include('layouts._partials.modal-auth')
    @endguest
  </body>
</html>
