<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $utilisateurs = [
            [
                'nom' => 'Alice Dupont',
                'email' => 'alice.dupont@example.com',
                'motDePasse' => Hash::make('securepass1'),
                'localite' => 'Paris',
                'adresse' => '12 Rue Lafayette',
                'codePostal' => 75009,
                'numeroTelephone' => 33678901234,
                'role' => 'prive',
                'statut' => 'validé',
                'dateCreation' => Carbon::now(),
            ],
            [
                'nom' => 'Marc Lemaitre',
                'email' => 'marc.lemaitre@example.com',
                'motDePasse' => Hash::make('securepass2'),
                'localite' => 'Bruxelles',
                'adresse' => '34 Avenue Louise',
                'codePostal' => 1000,
                'numeroTelephone' => 32456789012,
                'role' => 'admin',
                'statut' => 'validé',
                'dateCreation' => Carbon::now(),
            ],
            [
                'nom' => 'Comptarial',
                'email' => 'comptarial@example.com',
                'motDePasse' => Hash::make('securepass3'),
                'localite' => 'Lyon',
                'adresse' => '5 Place Bellecour',
                'codePostal' => 69002,
                'numeroTelephone' => 33765432109,
                'role' => 'entreprise',
                'statut' => 'validé',
                'dateCreation' => Carbon::now(),
            ],
        ];

        // Insérer les utilisateurs dans la base de données
        DB::table('user')->insert($utilisateurs);
    }
}
