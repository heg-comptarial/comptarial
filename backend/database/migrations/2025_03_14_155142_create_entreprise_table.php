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
        Schema::create('entreprise', function (Blueprint $table) {
            $table->bigIncrements('entreprise_id');
            $table->unsignedBigInteger('client_id')->index('client_id');
            $table->string('raison_sociale');
            $table->text('prestations');
            $table->enum('nouvelle_entreprise', ['Y', 'N'])->default('N');
            $table->string('grand_livre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entreprise');
    }
};
