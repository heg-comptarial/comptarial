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
            $table->unsignedBigInteger('rubrique_id')->index('rubrique_id');
            $table->string('nom')->nullable();
            $table->enum('type', ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpeg', 'jpg', 'png', 'other'])->nullable();
            $table->string('cheminFichier')->nullable();
            $table->enum('statut', ['pending', 'approved', 'rejected'])->nullable();
            $table->string('sous_rubrique');
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
