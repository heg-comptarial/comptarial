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
        Schema::table('Commentaire', function (Blueprint $table) {
            $table->foreign(['admin_id'])->references(['admin_id'])->on('Administrateur')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['document_id'])->references(['doc_id'])->on('Document')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Commentaire', function (Blueprint $table) {
            $table->dropForeign('commentaire_admin_id_foreign');
            $table->dropForeign('commentaire_document_id_foreign');
        });
    }
};
