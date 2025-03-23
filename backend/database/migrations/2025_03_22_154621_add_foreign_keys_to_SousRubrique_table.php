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
            $table->foreign(['rubrique_id'], 'sousrubrique_ibfk_1')->references(['rubrique_id'])->on('Rubrique')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sousrubrique', function (Blueprint $table) {
            $table->dropForeign('sousrubrique_ibfk_1');
        });
    }
};
