<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SousRubriqueSeeder extends Seeder
{
    public function run()
    {
        DB::table('sousrubrique')->insert([
            [
                'rubrique_id' => 1,
                'titre' => 'Sous Rubrique 1',
                'description' => 'Description de la sous-rubrique 1',
            ],
            [
                'rubrique_id' => 2,
                'titre' => 'Sous Rubrique 2',
                'description' => 'Description de la sous-rubrique 2',
            ],
            [
                'rubrique_id' => 1,
                'titre' => 'Sous Rubrique 3',
                'description' => 'Description de la sous-rubrique 3',
            ],
        ]);
    }
}