<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EnfantSeeder extends Seeder
{
    public function run()
    {
        DB::table('enfants')->insert([
            [
                'prive_id' => 1,
                'nom' => 'Dupont',
                'prenom' => 'Alice',
                'dateNaissance' => '2010-05-15',
                'adresse' => '123 Rue de Paris',
                'codePostal' => '75001',
                'localite' => 'Paris',
                'noAVS' => '123456789012',
                'noContribuable' => '987654321',
                'revenuBrut' => 5000.00,
                'fortuneNet' => 10000.00,
            ],
            [
                'prive_id' => 2,
                'nom' => 'Smith',
                'prenom' => 'Bob',
                'dateNaissance' => '2012-10-20',
                'adresse' => '456 Avenue de Bruxelles',
                'codePostal' => '1000',
                'localite' => 'Bruxelles',
                'noAVS' => '987654321098',
                'noContribuable' => '123456789',
                'revenuBrut' => 3000.00,
                'fortuneNet' => 5000.00,
            ],
        ]);
    }
}