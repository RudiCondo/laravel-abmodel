<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id('id_pedido');
            $table->unsignedBigInteger('id_usuario');
            $table->enum('estado', ['pendiente','confirmado','en_proceso','enviado','entregado'])->default('pendiente');
            $table->enum('metodo_pago', ['manual','pendiente'])->default('pendiente');
            $table->decimal('total', 10, 2)->default(0);
            $table->timestamps();

            // Clave foránea
            $table->foreign('id_usuario')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
