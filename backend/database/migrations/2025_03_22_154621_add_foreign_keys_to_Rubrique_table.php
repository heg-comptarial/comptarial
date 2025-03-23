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
            $table->foreign(['declaration_id'], 'rubrique_ibfk_1')->references(['declaration_id'])->on('Declaration')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rubrique', function (Blueprint $table) {
            $table->dropForeign('rubrique_ibfk_1');
        });
    }
};
