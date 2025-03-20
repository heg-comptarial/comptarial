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
                'nationalité' => 'Française',
                'dateDeNaissance' => '2000-01-01',
                'etatCivil' => 'Marié',
                'numeroFiscal' => 'FR123456789',
            ]
        ];

        // Insérer les enregistrements privés dans la base de données
        DB::table('prive')->insert($priveRecords);
    }
}
