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
        Schema::create('pensionalimentaire', function (Blueprint $table) {
            $table->bigIncrements('pension_id');
            $table->unsignedBigInteger('enfant_id')->index('enfant_id');
            $table->enum('statut', ['verse', 'recu']);
            $table->decimal('montantContribution', 10);
            $table->string('nom');
            $table->string('prenom');
            $table->string('noContribuable');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pensionalimentaire');
    }
};
