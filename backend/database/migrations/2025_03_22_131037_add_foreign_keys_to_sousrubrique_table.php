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
        Schema::table('sousrubrique', function (Blueprint $table) {
            $table->foreign(['rubrique_id'])->references(['rubrique_id'])->on('rubrique')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sousrubrique', function (Blueprint $table) {
            $table->dropForeign('sousrubrique_rubrique_id_foreign');
        });
    }
};
