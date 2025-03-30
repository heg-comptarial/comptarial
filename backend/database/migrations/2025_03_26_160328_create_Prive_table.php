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
        Schema::create('Prive', function (Blueprint $table) {
            $table->bigIncrements('prive_id');
            $table->unsignedBigInteger('user_id')->index('prive_user_id_foreign');
            $table->date('dateNaissance')->nullable();
            $table->string('nationalite')->nullable();
            $table->string('etatCivil')->nullable();
            $table->boolean('fo_banques')->default(false);
            $table->boolean('fo_dettes')->default(false);
            $table->boolean('fo_immobiliers')->default(false);
            $table->boolean('fo_salarie')->default(false);
            $table->boolean('fo_autrePersonneCharge')->default(false);
            $table->boolean('fo_independant')->default(false);
            $table->boolean('fo_rentier')->default(false);
            $table->boolean('fo_autreRevenu')->default(false);
            $table->boolean('fo_assurance')->default(false);
            $table->boolean('fo_autreDeduction')->default(false);
            $table->boolean('fo_autreInformations')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Prive');
    }
};
