<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_comentario';

    protected $fillable = [
        'id_usuario',
        'id_producto',
        'id_tienda',
        'calificacion',
        'comentario'
    ];

    protected $casts = [
        'fecha_comentario' => 'datetime',
    ];

    // Relaciones

    // Un comentario pertenece a un usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id');
    }

    // Un comentario pertenece a un producto
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }

    // Un comentario pertenece a una tienda
    public function tienda()
    {
        return $this->belongsTo(Tienda::class, 'id_tienda', 'id_tienda');
    }
}
