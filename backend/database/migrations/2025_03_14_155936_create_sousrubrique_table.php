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
        Schema::create('sousrubrique', function (Blueprint $table) {
            $table->bigIncrements('sous_rub_id');
            $table->unsignedBigInteger('rubrique_id')->index('rubrique_id');
            $table->string('titre');
            $table->text('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sousrubrique');
    }
};
