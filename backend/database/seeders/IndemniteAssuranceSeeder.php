<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IndemniteAssuranceSeeder extends Seeder
{
    public function run()
    {
        DB::table('indemniteassurance')->insert([
            [
                'prive_id' => 3,
                'fo_chomage' => false,
                'fo_maladie' => true,
                'fo_accident' => false,
                'fo_materniteMilitairePC' => false,
            ],
        ]);
    }
}
