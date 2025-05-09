<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AutreInformationsSeeder extends Seeder
{
    public function run()
    {
        DB::table('autreinformations')->insert([
            [
                'prive_id' => 3,
                'fo_versementBoursesEtudes' => true,
                'fo_pensionsPercuesEnfantMajeurACharge' => false,
                'fo_prestationsAVSSPC' => true,
                'fo_prestationsFamilialesSPC' => false,
                'fo_prestationsVilleCommune' => true,
                'fo_allocationsImpotents' => false,
                'fo_reparationTortMoral' => false,
                'fo_hospiceGeneral' => false,
                'fo_institutionBienfaisance' => false,
            ],
        ]);
    }
}
