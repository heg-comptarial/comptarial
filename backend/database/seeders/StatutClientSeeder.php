<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatutClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statutClients = [
            [
                'client_id' => 1, // Assure-toi que le client avec ID 1 existe
                'nom' => 'Statut Actif',
            ],
            [
                'client_id' => 2, // Assure-toi que le client avec ID 2 existe
                'nom' => 'Statut Inactif',
            ],
        ];

        // Insérer les statuts des clients dans la base de données
        DB::table('statutclient')->insert($statutClients);
    }
}
