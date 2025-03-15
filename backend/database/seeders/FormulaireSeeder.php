<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FormulaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $formulaires = [
            [
                'prive_id' => 1, // Assure-toi que le privé avec ID 1 existe
                'declaration_id' => 1, // Assure-toi que la déclaration avec ID 1 existe
                'titre_formulaire' => 'Formulaire 1',
                'banques' => 'Y',
                'dettes' => 'N',
                'enfants' => 'Y',
                'immobiliers' => 'N',
            ],
            [
                'prive_id' => 2, // Assure-toi que le privé avec ID 2 existe
                'declaration_id' => 2, // Assure-toi que la déclaration avec ID 2 existe
                'titre_formulaire' => 'Formulaire 2',
                'banques' => 'N',
                'dettes' => 'Y',
                'enfants' => 'N',
                'immobiliers' => 'Y',
            ],
        ];

        // Insérer les formulaires dans la base de données
        DB::table('formulaire')->insert($formulaires);
    }
}
