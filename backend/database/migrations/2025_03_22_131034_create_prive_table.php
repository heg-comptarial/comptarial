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
            $table->unsignedBigInteger('user_id')->index('prive_user_id_foreign');
            $table->date('dateNaissance');
            $table->string('nationalite');
            $table->string('etatCivil');
            $table->boolean('fo_banques');
            $table->boolean('fo_dettes');
            $table->boolean('fo_immobiliers');
            $table->boolean('fo_salarie');
            $table->boolean('fo_autrePersonneCharge');
            $table->boolean('fo_independant');
            $table->boolean('fo_rentier');
            $table->boolean('fo_autreRevenu');
            $table->boolean('fo_assurance');
            $table->boolean('fo_autreDeduction');
            $table->boolean('fo_autreInformations');
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
