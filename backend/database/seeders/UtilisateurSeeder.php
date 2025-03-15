<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $utilisateurs = [
            [
                'nom' => 'John Doe',
                'email' => 'john.doe@example.com',
                'mot_de_passe' => Hash::make('password123'), // Hashing the password
                'localite' => 'Geneva',
                'adresse' => '123 Main St',
                'code_postal' => '1201',
                'numero_telephone' => '1234567890',
            ],
            [
                'nom' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'mot_de_passe' => Hash::make('password456'),
                'localite' => 'Lausanne',
                'adresse' => '456 Elm St',
                'code_postal' => '1001',
                'numero_telephone' => '0987654321',
            ],
        ];

        // Insérer les utilisateurs dans la base de données
        DB::table('utilisateur')->insert($utilisateurs);
    }
}
