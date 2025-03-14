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
        Schema::create('conjoint', function (Blueprint $table) {
            $table->bigIncrements('conjoint_id');
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->string('nom');
            $table->string('prenom');
            $table->string('nationalite');
            $table->date('date_de_naissance');
            $table->string('localite');
            $table->string('adresse');
            $table->string('code_postal', 10);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conjoint');
    }
};
