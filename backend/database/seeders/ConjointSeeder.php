<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConjointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $conjoints = [
            [
                'prive_id' => 1, // Assure-toi que le privé avec ID 1 existe
                'nom' => 'Conjoint 1',
                'prenom' => 'Marie',
                'nationalité' => 'Française',
                'dateDeNaissance' => '1986-05-21',
                'localite' => 'Paris',
                'adresse' => '123 Rue de Paris',
                'codePostal' => '75001',
                'SituationProfessionnelle' => 'Enseignante',
            ],
            [
                'prive_id' => 2, // Assure-toi que le privé avec ID 2 existe
                'nom' => 'Conjoint 2',
                'prenom' => 'Paul',
                'nationalité' => 'Française',
                'dateDeNaissance' => '1992-08-10',
                'localite' => 'Lyon',
                'adresse' => '456 Avenue de Lyon',
                'codePostal' => '69001',
                'SituationProfessionnelle' => 'Professeur',
            ],
        ];

        // Insérer les conjoints dans la base de données
        DB::table('conjoint')->insert($conjoints);
    }
}