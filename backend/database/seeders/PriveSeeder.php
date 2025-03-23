<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PriveSeeder extends Seeder
{
    public function run()
    {
        DB::table('prive')->insert([
            [
                'user_id' => 4,
                'dateNaissance' => '1990-01-01',
                'nationalite' => 'Française',
                'etatCivil' => 'Marié',
                'fo_banques' => true,
                'fo_dettes' => false,
                'fo_immobiliers' => true,
                'fo_salarie' => true,
                'fo_autrePersonneCharge' => false,
                'fo_independant' => false,
                'fo_rentier' => false,
                'fo_autreRevenu' => false,
                'fo_assurance' => true,
                'fo_autreDeduction' => false,
                'fo_autreInformations' => false,
            ],
            [
                'user_id' => 5,
                'dateNaissance' => '1985-01-01',
                'nationalite' => 'Belge',
                'etatCivil' => 'Célibataire',
                'fo_banques' => false,
                'fo_dettes' => true,
                'fo_immobiliers' => false,
                'fo_salarie' => false,
                'fo_autrePersonneCharge' => true,
                'fo_independant' => true,
                'fo_rentier' => false,
                'fo_autreRevenu' => false,
                'fo_assurance' => false,
                'fo_autreDeduction' => true,
                'fo_autreInformations' => true,
            ],
        ]);
    }
}