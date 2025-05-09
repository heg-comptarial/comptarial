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
        Schema::create('titre', function (Blueprint $table) {
            $table->bigIncrements('titre_id');
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->boolean('compteBancairePostale')->default(false);
            $table->boolean('actionOuPartSociale')->default(false);
            $table->boolean('autreElementFortune')->default(false);
            $table->boolean('aucunElementFortune')->default(false);
            $table->boolean('objetsValeur')->default(false)->comment('Monnaies en espèces; métaux précieux; or, bijoux, argenterie de + de 2000CHF; collections artistiques; véhicules');
            $table->boolean('fo_gainJeux')->default(false);
            $table->boolean('fo_releveFiscal')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('titre');
    }
};
