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
                'nationalite' => 'Française',
                'dateNaissance' => '1986-05-21',
                'localite' => 'Paris',
                'adresse' => '123 Rue de Paris',
                'codePostal' => '75001',
                'situationProfessionnelle' => 'Enseignante',
            ]
        ];

        // Insérer les conjoints dans la base de données
        DB::table('conjoint')->insert($conjoints);
    }
}