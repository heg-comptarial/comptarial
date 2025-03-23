<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Administrateur;

class AdministrateurSeeder extends Seeder
{
    public function run()
    {
        Administrateur::create([
            'user_id' => 1,
            'niveauAcces' => 'admin',
        ]);

        Administrateur::create([
            'user_id' => 2,
            'niveauAcces' => 'super_admin',
        ]);

        // Add more seed data as needed
    }
}