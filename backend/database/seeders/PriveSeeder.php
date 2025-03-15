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
                'client_id' => 1, // Assure-toi que le client avec ID 1 existe
                'nationalite' => 'Française',
                'date_de_naissance' => '1985-06-15',
                'etat_civil' => 'Marié',
            ],
            [
                'client_id' => 2, // Assure-toi que le client avec ID 2 existe
                'nationalite' => 'Française',
                'date_de_naissance' => '1990-12-22',
                'etat_civil' => 'Célibataire',
            ],
        ];

        // Insérer les enregistrements privés dans la base de données
        DB::table('prive')->insert($priveRecords);
    }
}
