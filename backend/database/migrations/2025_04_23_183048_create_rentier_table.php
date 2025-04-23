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
        Schema::create('rentier', function (Blueprint $table) {
            $table->bigIncrements('rentier_id');
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->boolean('fo_attestationRenteAVSAI')->default(false);
            $table->boolean('fo_attestationRentePrevoyance')->default(false);
            $table->boolean('fo_autresRentes')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentier');
    }
};
