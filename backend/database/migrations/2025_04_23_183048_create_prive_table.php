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
        Schema::create('prive', function (Blueprint $table) {
            $table->bigIncrements('prive_id');
            $table->unsignedBigInteger('user_id')->index('user_id');
            $table->date('dateNaissance');
            $table->string('nationalite');
            $table->string('etatCivil');
            $table->boolean('fo_enfants')->default(false);
            $table->boolean('fo_autrePersonneCharge')->default(false);
            $table->boolean('fo_revenu')->default(false);
            $table->boolean('fo_independant')->default(false);
            $table->boolean('fo_indemnitesAssurance')->default(false);
            $table->boolean('fo_rentier')->default(false);
            $table->boolean('fo_autresRevenus')->default(false);
            $table->boolean('fo_banques')->default(false);
            $table->boolean('fo_titres')->default(false);
            $table->boolean('fo_immobiliers')->default(false);
            $table->boolean('fo_dettes')->default(false);
            $table->boolean('fo_assurances')->default(false);
            $table->boolean('fo_autresDeductions')->default(false);
            $table->boolean('fo_autresInformations')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prive');
    }
};
