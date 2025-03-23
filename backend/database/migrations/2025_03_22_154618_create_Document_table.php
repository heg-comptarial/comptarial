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
        Schema::create('document', function (Blueprint $table) {
            $table->bigIncrements('doc_id');
            $table->unsignedBigInteger('sous_rub_id')->index('sous_rub_id');
            $table->string('titre');
            $table->enum('type', ['pdf', 'doc', 'xls', 'ppt', 'image', 'other']);
            $table->string('cheminFichier');
            $table->enum('statut', ['pending', 'approved', 'rejected']);
            $table->dateTime('dateCreation')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document');
    }
};
