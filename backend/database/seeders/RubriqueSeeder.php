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
                'declaration_id' => 1,
                'titre' => 'Rubrique 1',
                'description' => 'Description de la rubrique 1',
            ],
            [
                'declaration_id' => 1,
                'titre' => 'Rubrique 2',
                'description' => 'Description de la rubrique 2',
            ],
            [
                'declaration_id' => 1,
                'titre' => 'Rubrique 3',
                'description' => 'Description de la rubrique 3',
            ],
        ]);
    }
}