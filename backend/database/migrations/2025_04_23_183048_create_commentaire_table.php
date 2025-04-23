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
        Schema::create('commentaire', function (Blueprint $table) {
            $table->bigIncrements('commentaire_id');
            $table->unsignedBigInteger('document_id')->index('document_id');
            $table->unsignedBigInteger('admin_id')->index('admin_id');
            $table->string('contenu');
            $table->dateTime('dateCreation')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commentaire');
    }
};
