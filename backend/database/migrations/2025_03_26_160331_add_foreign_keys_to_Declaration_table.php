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
        Schema::table('Declaration', function (Blueprint $table) {
            $table->foreign(['user_id'])->references(['user_id'])->on('User')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Declaration', function (Blueprint $table) {
            $table->dropForeign('declaration_user_id_foreign');
        });
    }
};
