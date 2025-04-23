<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TitreSeeder extends Seeder
{
    public function run()
    {
        DB::table('titre')->insert([
            [
                'prive_id' => 3,
                'compteBancairePostale' => true,
                'actionOuPartSociale' => false,
                'autreElementFortune' => true,
                'aucunElementFortune' => false,
                'objetsValeur' => true,
                'fo_gainJeux' => false,
                'fo_releveFiscal' => true,
            ],
        ]);
    }
}
