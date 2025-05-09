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
        Schema::create('deduction', function (Blueprint $table) {
            $table->bigIncrements('autre_deduction_id');
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->boolean('fo_rachatLPP')->default(false);
            $table->boolean('fo_attestation3emePilierA')->default(false);
            $table->boolean('fo_attestation3emePilierB')->default(false)->comment('Assurance Vie et Vieillesse');
            $table->boolean('fo_attestationAssuranceMaladie')->default(false)->comment('Prime + Frais médicaux');
            $table->boolean('fo_attestationAssuranceAccident')->default(false);
            $table->boolean('fo_cotisationAVS')->default(false);
            $table->boolean('fo_fraisFormationProfessionnel')->default(false);
            $table->boolean('fo_fraisMedicaux')->default(false)->comment('Frais médicaux non pris en charge par assurance maladie');
            $table->boolean('fo_fraisHandicap')->default(false);
            $table->boolean('fo_dons')->default(false);
            $table->boolean('fo_versementPartisPolitiques')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deduction');
    }
};
