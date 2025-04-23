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
        Schema::create('autrepersonneacharge', function (Blueprint $table) {
            $table->bigIncrements('autre_personne_id');
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->string('nom');
            $table->string('prenom');
            $table->date('dateNaissance');
            $table->enum('degreParente', ['parents', 'enfant', 'grands-parents', 'frere-soeur', 'oncle-tante', 'neuveu-niece', 'autre']);
            $table->integer('nbPersonneParticipation')->comment('Nombre de personnes participant à entretenir la personne à charge');
            $table->boolean('vieAvecPersonneCharge')->default(false);
            $table->decimal('revenusBrutPersonneACharge', 10);
            $table->decimal('fortuneNetPersonneACharge', 10);
            $table->decimal('montantVerseAPersonneACharge', 10);
            $table->boolean('fo_preuveVersementEffectue')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('autrepersonneacharge');
    }
};
