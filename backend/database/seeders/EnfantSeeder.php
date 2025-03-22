<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Enfant;

class EnfantSeeder extends Seeder
{
    public function run(): void
    {
        Enfant::create([
            'prive_id' => 1,
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'dateNaissance' => '2010-05-15',
            'adresse' => '10 Rue des Lilas',
            'codePostal' => '1000',
            'localite' => 'Lausanne',
            'noAVS' => '756.1234.5678.97',
            'noContribuable' => '1234567890',
            'revenuBrut' => '55000',
            'fortuneNet' => '10000',
        ]);

        Enfant::create([
            'prive_id' => 1,
            'nom' => 'Martin',
            'prenom' => 'Claire',
            'dateNaissance' => '2012-09-10',
            'adresse' => '5 Avenue de la Gare',
            'codePostal' => '1200',
            'localite' => 'Genève',
            'noAVS' => '756.9876.5432.10',
            'noContribuable' => '9876543210',
            'revenuBrut' => '60000',
            'fortuneNet' => '15000',
        ]);

        // Ajoute plus de données si nécessaire...
    }
}
