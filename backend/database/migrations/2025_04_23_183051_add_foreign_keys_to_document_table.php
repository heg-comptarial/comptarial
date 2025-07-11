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
            $table->foreign(['rubrique_id'], 'document_ibfk_1')->references(['rubrique_id'])->on('rubrique')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document', function (Blueprint $table) {
            $table->dropForeign('document_ibfk_1');
        });
    }
};
