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
                'titreFormulaire' => 'Formulaire 1',
                'banques' => true,
                'dettes' => false,
                'enfants' => true,
                'immobiliers' => false,
            ],
            [
                'prive_id' => 2, // Assure-toi que le privé avec ID 2 existe
                'declaration_id' => 2, // Assure-toi que la déclaration avec ID 2 existe
                'titreFormulaire' => 'Formulaire 2',
                'banques' => false,
                'dettes' => true,
                'enfants' => false,
                'immobiliers' => true,
            ],
        ];

        // Insérer les formulaires dans la base de données
        DB::table('formulaire')->insert($formulaires);
    }
}
