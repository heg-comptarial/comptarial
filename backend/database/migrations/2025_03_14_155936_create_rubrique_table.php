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
        Schema::create('rubrique', function (Blueprint $table) {
            $table->bigIncrements('rubrique_id');
            $table->unsignedBigInteger('declaration_id')->index('declaration_id');
            $table->string('titre');
            $table->text('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rubrique');
    }
};
