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
        Schema::table('Document', function (Blueprint $table) {
            $table->foreign(['rubrique_id'])->references(['rubrique_id'])->on('Rubrique')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Document', function (Blueprint $table) {
            $table->dropForeign('document_rubrique_id_foreign');
        });
    }
};
