<!DOCTYPE html>
<html lang="es">
  <head>
    @include('layouts._partials.head')
    
    
  @vite(['resources/css/style.css', 'resources/js/modal-auth.js'])
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
