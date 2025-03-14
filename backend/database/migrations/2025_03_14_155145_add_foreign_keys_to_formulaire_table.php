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
        Schema::table('formulaire', function (Blueprint $table) {
            $table->foreign(['prive_id'], 'formulaire_ibfk_1')->references(['prive_id'])->on('prive')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['declaration_id'], 'formulaire_ibfk_2')->references(['declaration_id'])->on('declaration')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formulaire', function (Blueprint $table) {
            $table->dropForeign('formulaire_ibfk_1');
            $table->dropForeign('formulaire_ibfk_2');
        });
    }
};
