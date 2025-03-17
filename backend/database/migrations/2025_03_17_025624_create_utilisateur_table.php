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
        Schema::create('utilisateur', function (Blueprint $table) {
            $table->bigIncrements('utilisateur_id');
            $table->string('nom');
            $table->string('email')->unique('email');
            $table->string('mot_de_passe');
            $table->dateTime('date_creation')->useCurrent();
            $table->string('localite');
            $table->string('adresse');
            $table->string('code_postal', 10);
            $table->string('numero_telephone', 20);
            $table->enum('role', ['admin', 'client_prive', 'client_entreprise']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisateur');
    }
};
