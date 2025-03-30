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
        Schema::create('Administrateur', function (Blueprint $table) {
            $table->bigIncrements('admin_id');
            $table->unsignedBigInteger('user_id')->index('administrateur_user_id_foreign');
            $table->enum('niveauAcces', ['admin', 'super_admin'])->default('admin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Administrateur');
    }
};
