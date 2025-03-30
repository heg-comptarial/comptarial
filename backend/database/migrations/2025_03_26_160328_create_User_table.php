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
        Schema::create('User', function (Blueprint $table) {
            $table->bigIncrements('user_id');
            $table->string('nom');
            $table->string('email');
            $table->string('motDePasse')->comment('stores only hashed passwords, not plain text');
            $table->string('localite');
            $table->string('adresse');
            $table->string('codePostal', 10);
            $table->string('numeroTelephone', 20);
            $table->enum('role', ['admin', 'prive', 'entreprise']);
            $table->enum('statut', ['pending', 'rejected', 'approved'])->default('pending');
            $table->dateTime('dateCreation')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('User');
    }
};
