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
        Schema::create('autreinformations', function (Blueprint $table) {
            $table->bigIncrements('autre_informations_id');
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->boolean('fo_versementBoursesEtudes')->default(false);
            $table->boolean('fo_pensionsPercuesEnfantMajeurACharge')->default(false);
            $table->boolean('fo_prestationsAVSSPC')->default(false);
            $table->boolean('fo_prestationsFamilialesSPC')->default(false);
            $table->boolean('fo_prestationsVilleCommune')->default(false);
            $table->boolean('fo_allocationsImpotents')->default(false);
            $table->boolean('fo_reparationTortMoral')->default(false);
            $table->boolean('fo_hospiceGeneral')->default(false);
            $table->boolean('fo_institutionBienfaisance')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('autreinformations');
    }
};
