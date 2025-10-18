<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tienda extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_tienda';

    protected $fillable = [
        'id_usuario',
        'nombre_tienda',
        'descripcion',
        'logo_url',
        'estado'
    ];


    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    

    // Relaciones

    // Una tienda pertenece a un usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id');
    }

    // Una tienda tiene muchos productos
    public function productos()
    {
        return $this->hasMany(Producto::class, 'id_tienda', 'id_tienda');
    }

    // Una tienda tiene muchos comentarios
    public function comentarios()
    {
        return $this->hasMany(Comentario::class, 'id_tienda', 'id_tienda');
    }

    // Una tienda puede aparecer en muchos detalles de pedidos
    public function detallePedidos()
    {
        return $this->hasMany(DetallePedido::class, 'id_tienda', 'id_tienda');
    }
}
