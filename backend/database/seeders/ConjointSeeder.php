<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConjointSeeder extends Seeder
{
    public function run()
    {
        DB::table('conjoint')->insert([
            [
                'prive_id' => 1,
                'nom' => 'Dupont',
                'prenom' => 'Marie',
                'nationalite' => 'Française',
                'dateNaissance' => '1990-05-15',
                'localite' => 'Paris',
                'adresse' => '123 Rue de Paris',
                'codePostal' => '75001',
                'situationProfessionnelle' => 'Enseignante',
            ],
            [
                'prive_id' => 2,
                'nom' => 'Smith',
                'prenom' => 'John',
                'nationalite' => 'Belge',
                'dateNaissance' => '1985-10-20',
                'localite' => 'Bruxelles',
                'adresse' => '456 Avenue de Bruxelles',
                'codePostal' => '1000',
                'situationProfessionnelle' => 'Ingénieur',
            ],
        ]);
    }
}