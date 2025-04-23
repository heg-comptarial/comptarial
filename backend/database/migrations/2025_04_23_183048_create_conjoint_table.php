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
        Schema::create('conjoint', function (Blueprint $table) {
            $table->bigIncrements('conjoint_id');
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->string('nom');
            $table->string('prenom');
            $table->string('email', 254)->unique('email');
            $table->string('localite');
            $table->string('adresse');
            $table->string('codePostal', 10);
            $table->string('numeroTelephone', 25);
            $table->enum('etatCivil', ['Célibataire', 'Marié-e', 'Séparé-e', 'Divorcé-e', 'Veuf-Veuve', 'Partenariat', 'Partenariat séparé', 'Partenariat dissous', 'Partenariat veuf']);
            $table->date('dateNaissance');
            $table->string('nationalite');
            $table->string('professionExercee');
            $table->enum('contributionReligieuse', ['Église Catholique Chrétienne', 'Église Catholique Romaine', 'Église Protestante', 'Aucune organisation religieuse']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conjoint');
    }
};
