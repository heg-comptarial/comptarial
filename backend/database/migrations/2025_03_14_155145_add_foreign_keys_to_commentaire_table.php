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
            $table->foreign(['doc_id'], 'commentaire_ibfk_1')->references(['doc_id'])->on('document')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['admin_id'], 'commentaire_ibfk_2')->references(['admin_id'])->on('administrateur')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commentaire', function (Blueprint $table) {
            $table->dropForeign('commentaire_ibfk_1');
            $table->dropForeign('commentaire_ibfk_2');
        });
    }
};
