<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RevenuSeeder extends Seeder
{
    public function run()
    {
        DB::table('revenu')->insert([
            [
                'prive_id' => 3,
                'indemnites' => true,
                'interruptionsTravailNonPayees' => false,
                'interuptionsTravailNonPayeesDebut' => null,
                'interuptionsTravailNonPayeesFin' => null,
                'activiteIndependante' => true,
                'prestationsSociales' => false,
                'subsidesAssuranceMaladie' => true,
                'fo_certificatSalaire' => true,
                'fo_renteViagere' => false,
                'fo_allocationLogement' => false,
                'fo_preuveEncaissementSousLoc' => false,
                'fo_gainsAccessoires' => true,
                'fo_attestationAutresRevenus' => true,
                'fo_etatFinancier' => true,
            ],
        ]);
    }
}
