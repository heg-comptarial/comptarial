<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RubriqueSeeder extends Seeder
{
    public function run()
    {
        DB::table('rubrique')->insert([
            [
                'declaration_id' => 6,
                'titre' => 'Banques',
                'description' => 'Informations bancaires',
            ],
            [
                'declaration_id' => 6,
                'titre' => 'Dettes',
                'description' => 'Informations sur les dettes',
            ],
            [
                'declaration_id' => 7,
                'titre' => 'Banques',
                'description' => 'Informations bancaires',
            ],
            [
                'declaration_id' => 7,
                'titre' => 'Dettes',
                'description' => 'Informations sur les dettes',
            ],
            [
                'declaration_id' => 7,
                'titre' => 'Immobiliers',
                'description' => 'Informations sur les biens immobiliers',
            ],
            [
                'declaration_id' => 7,
                'titre' => 'Salariés',
                'description' => 'Informations sur les revenus salariés',
            ],
        ]);
    }
}