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
        Schema::create('interetdettes', function (Blueprint $table) {
            $table->bigIncrements('dettes_id');
            $table->unsignedBigInteger('prive_id')->index('prive_id')->unique();
            $table->boolean('fo_attestationEmprunt')->default(false)->comment('solde et intérêts');
            $table->boolean('fo_attestationCarteCredit')->default(false)->comment('solde et intérêts');
            $table->boolean('fo_attestationHypotheque')->default(false)->comment('solde et intérêts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interetdettes');
    }
};
