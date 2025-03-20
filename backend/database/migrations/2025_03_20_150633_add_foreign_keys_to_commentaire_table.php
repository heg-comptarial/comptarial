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
        Schema::table('commentaire', function (Blueprint $table) {
            $table->foreign(['admin_id'])->references(['admin_id'])->on('administrateur')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['document_id'])->references(['doc_id'])->on('document')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commentaire', function (Blueprint $table) {
            $table->dropForeign('commentaire_admin_id_foreign');
            $table->dropForeign('commentaire_document_id_foreign');
        });
    }
};
