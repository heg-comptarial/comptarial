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
        Schema::create('declaration', function (Blueprint $table) {
            $table->bigIncrements('declaration_id');
            $table->unsignedBigInteger('user_id')->index('user_id');
            $table->string('impots')->nullable();
            $table->enum('titre', ['Declaration', 'Comptabilité', 'TVA', 'Salaires', 'Administration', 'Fiscalité', 'Divers']);
            $table->enum('statut', ['pending', 'approved', 'rejected']);
            $table->year('annee');
            $table->dateTime('dateCreation')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('declaration');
    }
};
