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
        Schema::table('administrateur', function (Blueprint $table) {
            $table->foreign(['utilisateur_id'], 'administrateur_ibfk_1')->references(['utilisateur_id'])->on('utilisateur')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('administrateur', function (Blueprint $table) {
            $table->dropForeign('administrateur_ibfk_1');
        });
    }
};
