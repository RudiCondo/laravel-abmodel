import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/style.css',
                'resources/js/app.js',
                'resources/js/home.js',
                'resources/css/estilos-ceremoniales.css',
                'resources/js/productos.js',
                'resources/js/bootstrap.js',
                'resources/js/cliente.js',
                'resources/js/emprendedor.js',
                'resources/js/modal-auth.js',
            ],
            refresh: true,
        }),
    ],
});
