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
        Schema::table('pensionalimentaire', function (Blueprint $table) {
            $table->foreign(['enfant_id'], 'pensionalimentaire_ibfk_1')->references(['enfant_id'])->on('enfants')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pensionalimentaire', function (Blueprint $table) {
            $table->dropForeign('pensionalimentaire_ibfk_1');
        });
    }
};
