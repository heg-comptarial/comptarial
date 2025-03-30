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
        Schema::table('Rubrique', function (Blueprint $table) {
            $table->foreign(['declaration_id'])->references(['declaration_id'])->on('Declaration')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Rubrique', function (Blueprint $table) {
            $table->dropForeign('rubrique_declaration_id_foreign');
        });
    }
};
