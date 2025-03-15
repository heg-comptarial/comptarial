<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = [
            [
                'utilisateur_id' => 1, // Assure-toi que l'utilisateur avec ID 1 existe
                'type_entreprise' => 'Sarl',
                'adresse' => '123 Rue de Paris, 75001 Paris',
                'numero_fiscal' => '1234567890',
            ],
            [
                'utilisateur_id' => 2, // Assure-toi que l'utilisateur avec ID 2 existe
                'type_entreprise' => 'Eurl',
                'adresse' => '456 Avenue de Lyon, 69001 Lyon',
                'numero_fiscal' => '0987654321',
            ],
        ];

        // Insérer les clients dans la base de données
        DB::table('client')->insert($clients);
    }
}
