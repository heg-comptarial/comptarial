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
        Schema::create('banque', function (Blueprint $table) {
            $table->bigIncrements('banque_id');
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->boolean('fo_attestationFinAnnee')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banque');
    }
};
