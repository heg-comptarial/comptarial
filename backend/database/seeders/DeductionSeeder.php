<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DeductionSeeder extends Seeder
{
    public function run()
    {
        DB::table('deduction')->insert([
            [
                'prive_id' => 3,
                'fo_rachatLPP' => true,
                'fo_attestation3emePilierA' => true,
                'fo_attestation3emePilierB' => false,
                'fo_attestationAssuranceMaladie' => true,
                'fo_attestationAssuranceAccident' => false,
                'fo_cotisationAVS' => true,
                'fo_fraisFormationProfessionnel' => false,
                'fo_fraisMedicaux' => true,
                'fo_fraisHandicap' => false,
                'fo_dons' => true,
                'fo_versementPartisPolitiques' => false,
            ],
        ]);
    }
}
