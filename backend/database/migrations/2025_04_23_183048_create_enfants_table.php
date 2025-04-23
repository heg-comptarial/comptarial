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
        Schema::create('enfants', function (Blueprint $table) {
            $table->bigIncrements('enfant_id');
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->string('nom');
            $table->string('prenom');
            $table->date('dateNaissance');
            $table->string('adresse');
            $table->string('codePostal', 10);
            $table->string('localite');
            $table->string('noAVS');
            $table->string('noContribuable');
            $table->decimal('revenuBrut', 10);
            $table->decimal('fortuneNet', 10);
            $table->boolean('avantAgeScolaire')->default(false);
            $table->boolean('handicap')->default(false);
            $table->boolean('domicileAvecParents')->default(false);
            $table->boolean('parentsViventEnsemble')->default(false);
            $table->boolean('gardeAlternee')->default(false);
            $table->boolean('priseEnChargeFraisEgale')->default(false);
            $table->boolean('revenuNetSuperieurAAutreParent')->default(false);
            $table->decimal('fraisGarde', 10)->nullable();
            $table->decimal('primeAssuranceMaladie', 10);
            $table->decimal('subsideAssuranceMaladie', 10)->nullable();
            $table->decimal('fraisMedicaux', 10)->nullable();
            $table->decimal('primeAssuranceAccident', 10)->nullable();
            $table->decimal('allocationsFamilialesSuisse', 10)->nullable();
            $table->boolean('montantInclusDansSalaireBrut')->default(false);
            $table->decimal('allocationsFamilialesEtranger', 10)->nullable();
            $table->boolean('fo_scolaire')->default(false);
            $table->boolean('fo_scolaireStope')->default(false);
            $table->boolean('fo_certificatSalaire')->default(false);
            $table->boolean('fo_attestationFortune')->default(false);
            $table->boolean('fo_preuveVersementPensionAlim')->default(false);
            $table->boolean('fo_preuveEncaissementPensionAlim')->default(false);
            $table->boolean('fo_avanceScarpa')->default(false);
            $table->boolean('fo_fraisGardeEffectifs')->default(false);
            $table->boolean('fo_attestationAMPrimesAnnuel')->default(false);
            $table->boolean('fo_attestationAMFraisMedicaux')->default(false);
            $table->boolean('fo_attestationPaiementAssuranceAccident')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enfants');
    }
};
