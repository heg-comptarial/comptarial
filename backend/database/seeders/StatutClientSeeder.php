<?php

namespace Database\Seeders;

use App\Models\StatutClient;
use Illuminate\Database\Seeder;

class StatutClientSeeder extends Seeder
{
    public function run()
    {
        // Utiliser la factory pour générer des données
        StatutClient::factory(10)->create(); // Exemple pour créer 10 statuts clients
    }
}

