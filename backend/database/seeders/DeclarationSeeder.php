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
                'user_id' => 1, // Assure-toi que le client avec ID 1 existe
                'titre' => 'Déclaration 2025',
                'dateCreation' => Carbon::now(),
                'statut' => 'En cours',
            ],
            [
                'user_id' => 2, // Assure-toi que le client avec ID 2 existe
                'titre' => 'Déclaration 2024',
                'dateCreation' => Carbon::now(),
                'statut' => 'Complété',
            ],
        ];

        // Insérer les déclarations dans la base de données
        DB::table('declaration')->insert($declarations);
    }
}
