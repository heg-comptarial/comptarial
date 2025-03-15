<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DeclarationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $declarations = [
            [
                'client_id' => 1, // Assure-toi que le client avec ID 1 existe
                'titre' => 'Déclaration 2025',
                'statut' => 'En cours',
            ],
            [
                'client_id' => 2, // Assure-toi que le client avec ID 2 existe
                'titre' => 'Déclaration 2024',
                'statut' => 'Complété',
            ],
        ];

        // Insérer les déclarations dans la base de données
        DB::table('declaration')->insert($declarations);
    }
}
