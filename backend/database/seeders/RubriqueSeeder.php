<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RubriqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rubriques = [
            [
                'declaration_id' => 1, // Assure-toi que la déclaration avec ID 1 existe
                'titre' => 'Rubrique 1',
                'description' => 'Description de la rubrique 1',
            ],
            [
                'declaration_id' => 2, // Assure-toi que la déclaration avec ID 2 existe
                'titre' => 'Rubrique 2',
                'description' => 'Description de la rubrique 2',
            ],
        ];

        // Insérer les rubriques dans la base de données
        DB::table('rubrique')->insert($rubriques);
    }
}
