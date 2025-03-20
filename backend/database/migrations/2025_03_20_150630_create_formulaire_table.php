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
        Schema::create('formulaire', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('prive_id')->index('formulaire_prive_id_foreign');
            $table->unsignedBigInteger('declaration_id')->index('formulaire_declaration_id_foreign');
            $table->string('titreFormulaire');
            $table->boolean('banques');
            $table->boolean('dettes');
            $table->boolean('enfants');
            $table->boolean('immobiliers');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formulaire');
    }
};
