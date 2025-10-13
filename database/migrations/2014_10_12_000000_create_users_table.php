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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('telefono', 20)->nullable();       // nuevo campo
            $table->text('direccion')->nullable();           // nuevo campo
            $table->enum('rol', ['cliente','emprendedor','admin'])->default('cliente');
            $table->enum('estado', ['activo','inactivo'])->default('activo'); // nuevo campo
            $table->timestamp('ultimo_login')->nullable(); // campo opcional para último login
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
