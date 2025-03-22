<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SousRubriqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sousRubriques = [
            [
                'rubrique_id' => 1, // Assure-toi que la rubrique avec ID 1 existe
                'titre' => 'Sous-Rubrique 1',
                'description' => 'Description de la sous-rubrique 1',
            ],
            [
                'rubrique_id' => 2, // Assure-toi que la rubrique avec ID 2 existe
                'titre' => 'Sous-Rubrique 2',
                'description' => 'Description de la sous-rubrique 2',
            ],
        ];

        // Insérer les sous-rubriques dans la base de données
        DB::table('sousrubrique')->insert($sousRubriques);
    }
}
