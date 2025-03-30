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
        Schema::create('Entreprise', function (Blueprint $table) {
            $table->bigIncrements('entreprise_id');
            $table->unsignedBigInteger('user_id')->index('entreprise_user_id_foreign');
            $table->string('raisonSociale');
            $table->string('prestations');
            $table->string('grandLivre');
            $table->string('numeroFiscal');
            $table->boolean('nouvelleEntreprise')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Entreprise');
    }
};
