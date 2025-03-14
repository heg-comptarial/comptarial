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
        Schema::create('document', function (Blueprint $table) {
            $table->bigIncrements('doc_id');
            $table->unsignedBigInteger('sous_rub_id')->index('sous_rub_id');
            $table->string('titre');
            $table->string('type');
            $table->dateTime('date_ajout')->nullable()->useCurrent();
            $table->string('chemin_fichier');
            $table->string('statut');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document');
    }
};
