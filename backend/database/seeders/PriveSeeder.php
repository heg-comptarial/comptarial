<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PriveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $priveRecords = [
            [
                'user_id' => 1, // Assure-toi que le client avec ID 1 existe
                'dateNaissance' => '2000-01-01',
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
                'fo_autreInformations' => false
            ]
        ];

        // Insérer les enregistrements privés dans la base de données
        DB::table('prive')->insert($priveRecords);
    }
}
