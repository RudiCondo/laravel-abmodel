<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Corta y Estilizada</title>
    
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9; /* Fondo gris claro */
            color: #333; /* Texto oscuro */
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh; /* Ocupar toda la altura de la ventana */
            margin: 0;
        }

        .contenedor {
            background-color: #fff; /* Fondo blanco para el contenido */
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
        }

        h1 {
            color: #007bff; /* Título azul */
            margin-bottom: 10px;
        }

        p {
            font-size: 1.1em;
            line-height: 1.6;
        }

        .boton {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #28a745; /* Botón verde */
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        .boton:hover {
            background-color: #1e7e34;
        }
    </style>
</head>
<body>
    <div class="contenedor">
        <h1>🚀 Proyecto Rápido</h1>
        <p>Esta es una página web corta. Todo su diseño CSS está incluido directamente en la sección `&lt;head&gt;` del documento HTML.</p>
        <a href="#" class="boton">Ver Más</a>
    </div>
</body>
</html>