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
        Schema::create('notification', function (Blueprint $table) {
            $table->bigIncrements('notification_id');
            $table->unsignedBigInteger('user_id')->index('user_id');
            $table->string('contenu');
            $table->dateTime('dateCreation')->useCurrent();
            $table->boolean('isRead')->default(false); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification');
    }
};
