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
            $table->string('nationalité');
            $table->date('dateDeNaissance');
            $table->string('etatCivil');
            $table->string('numeroFiscal');
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
