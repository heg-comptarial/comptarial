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
        Schema::table('declaration', function (Blueprint $table) {
            $table->foreign(['client_id'], 'declaration_ibfk_1')->references(['client_id'])->on('client')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('declaration', function (Blueprint $table) {
            $table->dropForeign('declaration_ibfk_1');
        });
    }
};
