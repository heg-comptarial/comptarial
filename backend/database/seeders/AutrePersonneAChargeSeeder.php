<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AutrePersonneAChargeSeeder extends Seeder
{
    public function run()
    {
        DB::table('autrepersonneacharge')->insert([
            [
                'prive_id' => 3,
                'nom' => 'Lemoine',
                'prenom' => 'Jacques',
                'dateNaissance' => '1950-07-20',
                'degreParente' => 'parents',
                'nbPersonneParticipation' => 2,
                'vieAvecPersonneCharge' => true,
                'revenusBrutPersonneACharge' => 15000.00,
                'fortuneNetPersonneACharge' => 10000.00,
                'montantVerseAPersonneACharge' => 3000.00,
                'fo_preuveVersementEffectue' => true,
            ],
        ]);
    }
}
