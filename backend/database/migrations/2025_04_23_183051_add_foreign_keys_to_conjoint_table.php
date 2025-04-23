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
        Schema::table('conjoint', function (Blueprint $table) {
            $table->foreign(['prive_id'], 'conjoint_ibfk_1')->references(['prive_id'])->on('prive')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conjoint', function (Blueprint $table) {
            $table->dropForeign('conjoint_ibfk_1');
        });
    }
};
