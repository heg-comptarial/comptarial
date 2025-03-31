<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::table('User')->insert([
            [
                'nom' => 'Admin User',
                'email' => 'admin@example.com',
                'motDePasse' => Hash::make('password'), // Hash du mot de passe
                'localite' => 'Paris',
                'adresse' => '123 Rue Admin',
                'codePostal' => '75001',
                'numeroTelephone' => '0123456789',
                'role' => 'admin',
                'statut' => 'approved',
                'dateCreation' => now(),
            ],
            [
                'nom' => 'Super Admin User',
                'email' => 'super_admin@example.com',
                'motDePasse' => Hash::make('password'),
                'localite' => 'Carouge',
                'adresse' => '789 Rue Super Admin',
                'codePostal' => '1227',
                'numeroTelephone' => '0123456789',
                'role' => 'admin',
                'statut' => 'approved',
                'dateCreation' => now(),
            ],
            [
                'nom' => 'Entreprise User',
                'email' => 'entreprise@example.com',
                'motDePasse' => Hash::make('password'),
                'localite' => 'Lyon',
                'adresse' => '456 Rue Entreprise',
                'codePostal' => '69001',
                'numeroTelephone' => '0987654321',
                'role' => 'entreprise',
                'statut' => 'approved',
                'dateCreation' => now(),
            ],
            [
                'nom' => 'Prive User',
                'email' => 'prive@example.com',
                'motDePasse' => Hash::make('password'),
                'localite' => 'Marseille',
                'adresse' => '789 Rue Prive',
                'codePostal' => '13001',
                'numeroTelephone' => '0678901234',
                'role' => 'prive',
                'statut' => 'approved',
                'dateCreation' => now(),
            ],
            [
                'nom' => 'Prive User 2',
                'email' => 'prive2@example.com',
                'motDePasse' => Hash::make('password'),
                'localite' => 'Lille',
                'adresse' => '123 Rue Prive 2',
                'codePostal' => '59000',
                'numeroTelephone' => '0123456789',
                'role' => 'prive',
                'statut' => 'approved',
                'dateCreation' => now(),
            ],
            [
                'nom' => 'Prive User 3',
                'email' => 'prive3@example.com',
                'motDePasse' => Hash::make('password'),
                'localite' => 'Bordeaux',
                'adresse' => '456 Rue Prive 3',
                'codePostal' => '33000',
                'numeroTelephone' => '0987654321',
                'role' => 'prive',
                'statut' => 'approved',
                'dateCreation' => now(),
            ],
            [
                'nom' => 'Prive User 4',
                'email' => 'prive3@example.com',
                'motDePasse' => Hash::make('password'),
                'localite' => 'Bordeaux',
                'adresse' => '456 Rue Prive 3',
                'codePostal' => '33000',
                'numeroTelephone' => '0987654321',
                'role' => 'prive',
                'statut' => 'approved',
                'dateCreation' => now(),
            ]
        ]);
    }
}