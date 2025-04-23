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
            $table->string('email', 254)->unique('email')->comment('The email address of the user, used for login and communication.');
            $table->string('motDePasse')->comment('Stores hashed password');
            $table->string('localite');
            $table->string('adresse');
            $table->string('codePostal', 10);
            $table->string('numeroTelephone', 25);
            $table->enum('role', ['admin', 'prive', 'entreprise']);
            $table->enum('statut', ['approved', 'rejected', 'pending']);
            $table->dateTime('dateCreation')->useCurrent();
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
