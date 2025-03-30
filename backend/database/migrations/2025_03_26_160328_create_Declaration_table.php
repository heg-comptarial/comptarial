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
        Schema::create('Declaration', function (Blueprint $table) {
            $table->bigIncrements('declaration_id');
            $table->unsignedBigInteger('user_id')->index('declaration_user_id_foreign');
            $table->string('titre');
            $table->enum('statut', ['pending', 'rejected', 'approved'])->default('pending');
            $table->year('annee');
            $table->dateTime('dateCreation')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Declaration');
    }
};
