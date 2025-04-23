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
        Schema::create('immobilier', function (Blueprint $table) {
            $table->bigIncrements('immobilier_id');
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->enum('statut', ['occupe', 'loue', 'commercial-industriel', 'ppe', 'hlm'])->nullable();
            $table->string('canton');
            $table->string('commune');
            $table->string('pays');
            $table->string('noParcelleGeneve');
            $table->string('adresseComplete');
            $table->string('anneeConstruction');
            $table->date('occupeDesLe')->nullable();
            $table->date('dateAchat');
            $table->decimal('pourcentageProprietaire', 10)->comment('A quel pourcentage êtes vous propriétaire de ce bien');
            $table->string('autreProprietaire')->comment('Nom de autre propriétaire');
            $table->decimal('prixAchat', 10);
            $table->decimal('valeurLocativeBrut', 10)->nullable();
            $table->decimal('loyersEncaisses', 10)->nullable();
            $table->decimal('fraisEntretienDeductibles', 10);
            $table->boolean('fo_bienImmobilier')->default(false);
            $table->boolean('fo_attestationValeurLocative')->default(false);
            $table->boolean('fo_taxeFonciereBiensEtranger')->default(false);
            $table->boolean('fo_factureEntretienImmeuble')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('immobilier');
    }
};
