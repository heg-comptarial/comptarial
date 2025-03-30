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
        Schema::create('Commentaire', function (Blueprint $table) {
            $table->bigIncrements('commentaire_id');
            $table->unsignedBigInteger('document_id')->index('commentaire_document_id_foreign');
            $table->unsignedBigInteger('admin_id')->index('commentaire_admin_id_foreign');
            $table->string('contenu');
            $table->dateTime('dateCreation')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Commentaire');
    }
};
