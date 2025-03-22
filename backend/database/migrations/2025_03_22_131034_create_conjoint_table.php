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
            $table->unsignedBigInteger('prive_id')->index('conjoint_prive_id_foreign');
            $table->string('nom');
            $table->string('prenom');
            $table->string('nationalite');
            $table->date('dateNaissance');
            $table->string('localite');
            $table->string('adresse');
            $table->string('codePostal');
            $table->string('situationProfessionnelle');
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
