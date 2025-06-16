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
                // prive@example.com
                'user_id' => 4,
                'impots' => '2000 CHF',
                'titre' => 'Déclaration',
                'statut' => 'approved',
                'annee' => '2025',
                'dateCreation' => now(),
            ],
            [
                // prive@example.com
                'user_id' => 4,
                'impots' => null,
                'titre' => 'Déclaration',
                'statut' => 'pending',
                'annee' => '2024',
                'dateCreation' => now(),
            ],
            [
                // prive@example.com
                'user_id' => 4,
                'impots' => null,
                'titre' => 'Déclaration',
                'statut' => 'pending',
                'annee' => '2023',
                'dateCreation' => now(),
            ],
            [
                // prive2@example.com
                'user_id' => 5,
                'impots' => '1500 CHF',
                'titre' => 'Déclaration',
                'statut' => 'approved',
                'annee' => '2025',
                'dateCreation' => now(),
            ],
            [
                // prive3@example.com
                'user_id' => 6,
                'impots' => null,
                'titre' => 'Déclaration',
                'statut' => 'pending',
                'annee' => '2024',
                'dateCreation' => now(),
            ],
            [
                // prive4@example.com
                'user_id' => 7,
                'impots' => null,
                'titre' => 'Déclaration',
                'statut' => 'pending',
                'annee' => '2023',
                'dateCreation' => now(),
            ],
            [
                // prive4@example.com
                'user_id' => 7,
                'impots' => '2500 CHF',
                'titre' => 'Déclaration',
                'statut' => 'approved',
                'annee' => '2024',
                'dateCreation' => now(),
            ],
            [
                // prive4@example.com
                'user_id' => 7,
                'impots' => null,
                'titre' => 'Comptabilité',
                'statut' => 'pending',
                'annee' => '2025',
                'dateCreation' => now(),
            ],
            [
                // prive4@example.com
                'user_id' => 8,
                'impots' => null,
                'titre' => 'TVA',
                'statut' => 'pending',
                'annee' => '2023',
                'dateCreation' => now(),
            ],
            [
                // prive4@example.com
                'user_id' => 8,
                'impots' => null,
                'titre' => 'TVA',
                'statut' => 'pending',
                'annee' => '2022',
                'dateCreation' => now(),
            ],
            [
                // prive4@example.com
                'user_id' => 8,
                'impots' => null,
                'titre' => 'Comptabilité',
                'statut' => 'pending',
                'annee' => '2021',
                'dateCreation' => now(),
            ],
            [
                // prive4@example.com
                'user_id' => 8,
                'impots' => null,
                'titre' => 'Comptabilité',
                'statut' => 'pending',
                'annee' => '2024',
                'dateCreation' => now(),
            ],
            [
                // boran.uzun@etu.hesge.ch
                'user_id' => 10,
                'impots' => null,
                'titre' => 'Déclaration',
                'statut' => 'pending',
                'annee' => '2024',
                'dateCreation' => now(),
            ],
            [
                // entreprise@example.com
                'user_id' => 3,
                'impots' => null,
                'titre' => 'Comptabilité',
                'statut' => 'pending',
                'annee' => '2024',
                'dateCreation' => now(),
            ],
            [
                // entreprise@example.com
                'user_id' => 9,
                'impots' => null,
                'titre' => 'Comptabilité',
                'statut' => 'pending',
                'annee' => '2025',
                'dateCreation' => now(),
            ]
        ]);
    }
}