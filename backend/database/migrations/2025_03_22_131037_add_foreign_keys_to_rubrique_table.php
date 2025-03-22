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
        Schema::table('rubrique', function (Blueprint $table) {
            $table->foreign(['declaration_id'])->references(['declaration_id'])->on('declaration')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rubrique', function (Blueprint $table) {
            $table->dropForeign('rubrique_declaration_id_foreign');
        });
    }
};
