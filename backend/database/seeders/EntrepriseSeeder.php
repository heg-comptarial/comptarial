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
                'user_id' => 3, // Assure-toi que le client avec ID 1 existe
                'raisonSociale' => 'Comptarial',
                'prestations' => 'Services informatiques',
                'nouvelleEntreprise' => false,
                'grandLivre' => 'Livre A',
                'numeroFiscal' => 'FR987654321',
            ]
        ];

        // Insérer les entreprises dans la base de données
        DB::table('entreprise')->insert($entreprises);
    }
}
