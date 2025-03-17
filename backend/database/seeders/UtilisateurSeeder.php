<?php

namespace Database\Seeders;

use App\Models\Utilisateur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un utilisateur admin
        Utilisateur::create([
            'nom' => 'Admin',
            'prenom' => 'Super',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('admin123'),
            'telephone' => '01 23 45 67 89',
        ]);

        // Créer des utilisateurs spécifiques
        $customUsers = [
            [
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'email' => 'jean.dupont@example.com',
                'telephone' => '01 23 45 67 89',
            ],
            [
                'nom' => 'Martin',
                'prenom' => 'Marie',
                'email' => 'marie.martin@example.com',
                'telephone' => '06 12 34 56 78',
            ],
            [
                'nom' => 'Durand',
                'prenom' => 'Pierre',
                'email' => 'pierre.durand@example.com',
                'telephone' => '07 98 76 54 32',
            ],
            [
                'nom' => 'Lefebvre',
                'prenom' => 'Sophie',
                'email' => 'sophie.lefebvre@example.com',
                'telephone' => '01 87 65 43 21',
            ],
            [
                'nom' => 'Bernard',
                'prenom' => 'Thomas',
                'email' => 'thomas.bernard@example.com',
                'telephone' => '06 54 32 10 98',
            ],
        ];

        foreach ($customUsers as $userData) {
            Utilisateur::create([
                'nom' => $userData['nom'],
                'prenom' => $userData['prenom'],
                'email' => $userData['email'],
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'telephone' => $userData['telephone'],
            ]);
        }

        // Créer 15 utilisateurs aléatoires supplémentaires
        Utilisateur::factory()->count(15)->create();
    }
}

