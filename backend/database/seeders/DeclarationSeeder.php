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
                'user_id' => 3,
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
                'user_id' => 5,
                'titre' => 'Déclaration 2023',
                'statut' => 'rejected',
                'annee' => '2023',
                'dateCreation' => now(),
            ],
        ]);
    }
}