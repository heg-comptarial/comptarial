<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DeclarationSeeder extends Seeder
{
    public function run()
    {
        DB::table('declaration')->insert([
            [
                'user_id' => 4,
                'titre' => 'Déclaration 2025',
                'statut' => 'approved',
                'annee' => '2025',
                'dateCreation' => now(),
            ],
            [
                'user_id' => 4,
                'titre' => 'Déclaration 2024',
                'statut' => 'pending',
                'annee' => '2024',
                'dateCreation' => now(),
            ],
            [
                'user_id' => 4,
                'titre' => 'Déclaration 2023',
                'statut' => 'rejected',
                'annee' => '2023',
                'dateCreation' => now(),
            ],
            [
                'user_id' => 5,
                'titre' => 'Déclaration 2025',
                'statut' => 'approved',
                'annee' => '2025',
                'dateCreation' => now(),
            ],
            [
                'user_id' => 6,
                'titre' => 'Déclaration 2030',
                'statut' => 'pending',
                'annee' => '2030',
                'dateCreation' => now(),
            ],
            [
                'user_id' => 7,
                'titre' => 'Déclaration 2024',
                'statut' => 'approved',
                'annee' => '2024',
                'dateCreation' => now(),
            ],
            [
                'user_id' => 7,
                'titre' => 'Déclaration 2025',
                'statut' => 'pending',
                'annee' => '2025',
                'dateCreation' => now(),
            ]
        ]);
    }
}