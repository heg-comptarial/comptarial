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
        Schema::create('Document', function (Blueprint $table) {
            $table->bigIncrements('doc_id');
            $table->unsignedBigInteger('rubrique_id')->index('document_rubrique_id_foreign');
            $table->string('nom');
            $table->enum('type', ['pdf', 'doc', 'xls', 'ppt', 'jpeg', 'jpg', 'png', 'other']);
            $table->string('cheminFichier');
            $table->enum('statut', ['pending', 'rejected', 'approved'])->default('pending');
            $table->string('sous_rubrique')->nullable();
            $table->dateTime('dateCreation')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Document');
    }
};
