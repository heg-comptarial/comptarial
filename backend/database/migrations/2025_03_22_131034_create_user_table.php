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
        Schema::create('user', function (Blueprint $table) {
            $table->bigIncrements('user_id');
            $table->string('nom');
            $table->string('email');
            $table->string('motDePasse');
            $table->string('localite');
            $table->string('adresse');
            $table->string('codePostal');
            $table->string('numeroTelephone');
            $table->string('role');
            $table->string('statut');
            $table->dateTime('dateCreation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};
