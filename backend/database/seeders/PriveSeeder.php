<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PriveSeeder extends Seeder
{
    public function run()
    {
        DB::table('prive')->insert([
            // [
                // 'user_id' => 4,
                // 'dateNaissance' => null,
                // 'nationalite' => 'Française',
                // 'etatCivil' => 'Marié',
                // 'fo_banques' => true,
                // 'fo_dettes' => false,
                // 'fo_immobiliers' => true,
                // 'fo_salarie' => true,
                // 'fo_autrePersonneCharge' => false,
                // 'fo_rentier' => false,
                // 'fo_autreRevenu' => false,
                // 'fo_assurance' => true,
                // 'fo_autreDeduction' => false,
                // 'fo_autreInformations' => false,
            // ],
            [
                'user_id' => 5,
                'dateNaissance' => '1985-01-01',
                'nationalite' => 'Belge',
                'etatCivil' => 'Célibataire',
                'fo_enfants' => false,
                'fo_autrePersonneCharge' => true,
                'fo_revenu' => false,
                'fo_rentier' => false,
                'fo_banques' => false,
                'fo_titres' => false,
                'fo_immobiliers' => false,
                'fo_dettes' => true,
                'fo_assurances' => false,
                'fo_autresDeductions' => true,
                'fo_autresInformations' => true,
            ],
            [
                'user_id' => 6,
                'dateNaissance' => '1990-01-01',
                'nationalite' => 'Française',
                'etatCivil' => 'Célibataire',
                'fo_enfants' => false,
                'fo_autrePersonneCharge' => true,
                'fo_revenu' => false,
                'fo_rentier' => false,
                'fo_banques' => false,
                'fo_titres' => false,
                'fo_immobiliers' => false,
                'fo_dettes' => true,
                'fo_assurances' => false,
                'fo_autresDeductions' => true,
                'fo_autresInformations' => true,
            ],
            [
                'user_id' => 7,
                'dateNaissance' => '1990-01-27',
                'nationalite' => 'Suisse',
                'etatCivil' => 'Célibataire',
                'fo_enfants' => true,
                'fo_autrePersonneCharge' => true,
                'fo_revenu' => true,
                'fo_rentier' => true,
                'fo_banques' => true,
                'fo_titres' => true,
                'fo_immobiliers' => true,
                'fo_dettes' => true,
                'fo_assurances' => true,
                'fo_autresDeductions' => true,
                'fo_autresInformations' => true,
            ],
        ]);
    }
}