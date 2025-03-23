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
        Schema::create('enfants', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->string('nom');
            $table->string('prenom');
            $table->date('dateNaissance');
            $table->string('adresse');
            $table->string('codePostal', 10);
            $table->string('localite');
            $table->string('noAVS');
            $table->string('noContribuable');
            $table->decimal('revenuBrut', 10);
            $table->decimal('fortuneNet', 10);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enfants');
    }
};
