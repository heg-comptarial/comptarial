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
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->unsignedBigInteger('declaration_id')->index('declaration_id');
            $table->string('titre_formulaire');
            $table->enum('banques', ['Y', 'N'])->default('N');
            $table->enum('dettes', ['Y', 'N'])->default('N');
            $table->enum('enfants', ['Y', 'N'])->default('N');
            $table->enum('immobiliers', ['Y', 'N'])->default('N');
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
