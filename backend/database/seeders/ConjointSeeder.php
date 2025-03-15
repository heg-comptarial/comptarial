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
                'date_de_naissance' => '1986-05-21',
                'localite' => 'Paris',
                'adresse' => '123 Rue de Paris',
                'code_postal' => '75001',
            ],
            [
                'prive_id' => 2, // Assure-toi que le privé avec ID 2 existe
                'nom' => 'Conjoint 2',
                'prenom' => 'Paul',
                'nationalite' => 'Française',
                'date_de_naissance' => '1992-08-10',
                'localite' => 'Lyon',
                'adresse' => '456 Avenue de Lyon',
                'code_postal' => '69001',
            ],
        ];

        // Insérer les conjoints dans la base de données
        DB::table('conjoint')->insert($conjoints);
    }
}