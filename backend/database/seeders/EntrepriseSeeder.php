<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EntrepriseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $entreprises = [
            [
                'client_id' => 1, // Assure-toi que le client avec ID 1 existe
                'raison_sociale' => 'Entreprise A',
                'prestations' => 'Services informatiques',
                'nouvelle_entreprise' => 'Y',
                'grand_livre' => 'Livre A',
            ],
            [
                'client_id' => 2, // Assure-toi que le client avec ID 2 existe
                'raison_sociale' => 'Entreprise B',
                'prestations' => 'Consultation financière',
                'nouvelle_entreprise' => 'N',
                'grand_livre' => 'Livre B',
            ],
        ];

        // Insérer les entreprises dans la base de données
        DB::table('entreprise')->insert($entreprises);
    }
}
