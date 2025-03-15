<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdministrateurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $administrateurs = [
            [
                'utilisateur_id' => 1, // Assure-toi que l'utilisateur avec ID 1 existe
                'niveau_acces' => 'Super Admin',
            ],
            [
                'utilisateur_id' => 2, // Assure-toi que l'utilisateur avec ID 2 existe
                'niveau_acces' => 'Admin',
            ],
        ];

        // Insérer les administrateurs dans la base de données
        DB::table('administrateur')->insert($administrateurs);
    }
}
