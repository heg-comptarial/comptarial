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
        Schema::table('Enfants', function (Blueprint $table) {
            $table->foreign(['prive_id'])->references(['prive_id'])->on('Prive')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Enfants', function (Blueprint $table) {
            $table->dropForeign('enfants_prive_id_foreign');
        });
    }
};
