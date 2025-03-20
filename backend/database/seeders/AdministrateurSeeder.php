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
                'user_id' => 2, // Assure-toi que l'utilisateur avec ID 1 existe
                'niveauAcces' => 'Super Admin',
            ]
        ];

        // Insérer les administrateurs dans la base de données
        DB::table('administrateur')->insert($administrateurs);
    }
}
