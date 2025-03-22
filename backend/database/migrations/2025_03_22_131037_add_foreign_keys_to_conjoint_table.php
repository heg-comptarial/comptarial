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
            $table->foreign(['prive_id'])->references(['prive_id'])->on('prive')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conjoint', function (Blueprint $table) {
            $table->dropForeign('conjoint_prive_id_foreign');
        });
    }
};
