<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DeclarationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $declarations = [
            [
                'user_id' => 1, // Assure-toi que l'utilisateur avec ID 1 existe
                'titre' => 'Déclaration 2025',
                'statut' => 'En cours',
                'annee' => 2025,
                'dateCreation' => Carbon::now(),
            ],
            [
                'user_id' => 1, // Assure-toi que l'utilisateur avec ID 1 existe
                'titre' => 'Déclaration 2024',
                'dateCreation' => Carbon::now(),
                'statut' => 'Complété',
                'annee' => 2021
            ],
        ];

        // Insérer les déclarations dans la base de données
        DB::table('declaration')->insert($declarations);
    }
}
