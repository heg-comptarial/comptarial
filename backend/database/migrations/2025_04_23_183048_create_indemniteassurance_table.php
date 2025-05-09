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
        Schema::create('indemniteassurance', function (Blueprint $table) {
            $table->bigIncrements('indemnite_assurance_id');
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->boolean('fo_chomage')->default(false);
            $table->boolean('fo_maladie')->default(false);
            $table->boolean('fo_accident')->default(false);
            $table->boolean('fo_materniteMilitairePC')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indemniteassurance');
    }
};
