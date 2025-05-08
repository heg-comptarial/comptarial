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
            ],
            [
                'declaration_id' => 6,
                'titre' => 'Dettes',
            ],
            [
                'declaration_id' => 7,
                'titre' => 'Banques',
            ],
            [
                'declaration_id' => 7,
                'titre' => 'Dettes',
            ],
            [
                'declaration_id' => 7,
                'titre' => 'Immobiliers',
            ],
            [
                'declaration_id' => 7,
                'titre' => 'Salariés',
            ],
            [
                'declaration_id' => 8,
                'titre' => 'Immobiliers',
            ],
            [
                'declaration_id' => 8,
                'titre' => 'Salariés',
            ],
        ]);
    }
}