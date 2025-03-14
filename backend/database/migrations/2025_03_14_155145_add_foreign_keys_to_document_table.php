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
        Schema::table('document', function (Blueprint $table) {
            $table->foreign(['client_id'], 'document_ibfk_1')->references(['client_id'])->on('client')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['sous_rub_id'], 'document_ibfk_2')->references(['sous_rub_id'])->on('sousrubrique')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document', function (Blueprint $table) {
            $table->dropForeign('document_ibfk_1');
            $table->dropForeign('document_ibfk_2');
        });
    }
};
