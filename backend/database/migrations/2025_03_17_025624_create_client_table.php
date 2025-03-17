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
        Schema::create('client', function (Blueprint $table) {
            $table->bigIncrements('client_id');
            $table->unsignedBigInteger('user_id')->unique('user_id');
            $table->string('type_entreprise');
            $table->string('adresse');
            $table->string('numero_fiscal');
            $table->enum('statut_client', ['Accepté', 'Suspendu', 'Refusé']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client');
    }
};
