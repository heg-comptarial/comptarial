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
        Schema::create('statutclient', function (Blueprint $table) {
            $table->bigIncrements('statut_client_id');
            $table->unsignedBigInteger('client_id')->index('client_id');
            $table->string('statut');
            $table->dateTime('date_statut')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('statutclient');
    }
};
