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
            $table->string('name'); // Ajout de la colonne 'nom'
            $table->string('email')->unique(); // Ajout de la colonne 'email'
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password'); 
            $table->rememberToken();
            $table->string('mot_de_passe'); // Ajout de la colonne 'mot_de_passe'
            $table->datetime('date_creation')->default(now()); // Ajout de la colonne 'date_creation'
            $table->string('localite'); // Ajout de la colonne 'localite'
            $table->string('adresse'); // Ajout de la colonne 'adresse'
            $table->string('code_postal'); // Ajout de la colonne 'code_postal'
            $table->string('numero_telephone'); // Ajout de la colonne 'numero_telephone'
            $table->enum('role', ['admin', 'client_prive', 'client_entreprise']); // Ajout de la colonne 'role'
            $table->timestamps(); // Les timestamps Laravel par défaut
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

