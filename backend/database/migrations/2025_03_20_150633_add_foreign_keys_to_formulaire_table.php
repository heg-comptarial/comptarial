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
            $table->foreign(['declaration_id'])->references(['declaration_id'])->on('declaration')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['prive_id'])->references(['prive_id'])->on('prive')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formulaire', function (Blueprint $table) {
            $table->dropForeign('formulaire_declaration_id_foreign');
            $table->dropForeign('formulaire_prive_id_foreign');
        });
    }
};
