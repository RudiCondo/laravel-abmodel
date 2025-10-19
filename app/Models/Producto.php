<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_producto';

    protected $fillable = [
        'id_tienda',
        'id_categoria',
        'nombre_producto',
        'descripcion',
        'precio',
        'stock',
        'imagen_url'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relaciones

    // Un producto pertenece a una tienda
    public function tienda()
    {
        return $this->belongsTo(Tienda::class, 'id_tienda', 'id_tienda');
    }

    // Un producto puede pertenecer a una categoría
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'id_categoria', 'id_categoria');
    }

    // Un producto puede tener muchos comentarios
    public function comentarios()
    {
        return $this->hasMany(Comentario::class, 'id_producto', 'id_producto');
    }

    // Un producto puede aparecer en muchos detalles de carrito
    public function detalleCarrito()
    {
        return $this->hasMany(DetalleCarrito::class, 'id_producto', 'id_producto');
    }

    // Un producto puede aparecer en muchos detalles de pedidos
    public function detallePedidos()
    {
        return $this->hasMany(DetallePedido::class, 'id_producto', 'id_producto');
    }
}
