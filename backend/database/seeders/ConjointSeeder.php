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
                'prive_id' => 3,
                'nom' => 'Dupont',
                'prenom' => 'Marie',
                'email' => 'marieDupont@example.com',
                'localite' => 'Paris',
                'adresse' => '123 Rue de Paris',
                'codePostal' => '75001',
                'numeroTelephone' => '0123456789',
                'etatCivil' => 'Marié-e',
                'dateNaissance' => '1990-05-15',
                'nationalite' => 'Française',
                'professionExercee' => 'Enseignante',
                'contributionReligieuse' => 'Église Catholique Chrétienne',
            ],
            [
                'prive_id' => 2,
                'nom' => 'Martin',
                'prenom' => 'Claire',
                'email' => 'claire.martin@example.com',
                'localite' => 'Lyon',
                'adresse' => '45 Avenue des Lilas',
                'codePostal' => '1000',
                'numeroTelephone' => '+41210000000',
                'etatCivil' => 'Partenariat',
                'dateNaissance' => '1988-11-22',
                'nationalite' => 'Suisse',
                'professionExercee' => 'Architecte',
                'contributionReligieuse' => 'Aucune organisation religieuse',
            ],
        ]);
    }
}