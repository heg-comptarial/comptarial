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
        Schema::create('revenu', function (Blueprint $table) {
            $table->bigIncrements('revenu_id');
            $table->unsignedBigInteger('prive_id')->index('prive_id');
            $table->boolean('indemnites')->default(false)->comment('Indemnités de chômage, maladie, accident, maternité')->nullable();
            $table->boolean('interruptionsTravailNonPayees')->default(false);
            $table->date('interuptionsTravailNonPayeesDebut')->nullable();
            $table->date('interuptionsTravailNonPayeesFin')->nullable();
            $table->boolean('activiteIndependante')->default(false);
            $table->boolean('prestationsSociales')->default(false)->comment('AVS/AI, LPP, Assurance militaire, Etrangères, Autres');
            $table->boolean('subsidesAssuranceMaladie')->default(false);
            $table->boolean('fo_certificatSalaire')->default(false);
            $table->boolean('fo_renteViagere')->default(false)->comment('Autres revenus');
            $table->boolean('fo_allocationLogement')->default(false)->comment('Autres revenus');
            $table->boolean('fo_preuveEncaissementSousLoc')->default(false)->comment('Autres revenus');
            $table->boolean('fo_gainsAccessoires')->default(false)->comment('2300 CHF non soumis à AVS');
            $table->boolean('fo_attestationAutresRevenus')->default(false)->comment('Autres revenus');
            $table->boolean('fo_etatFinancier')->default(false)->comment('Indépendant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('revenu');
    }
};
