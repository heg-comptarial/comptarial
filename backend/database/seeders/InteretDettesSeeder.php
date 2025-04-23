<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InteretDettesSeeder extends Seeder
{
    public function run()
    {
        DB::table('interetdettes')->insert([
            [
                'prive_id' => 3,
                'fo_attestationEmprunt' => true,
                'fo_attestationCarteCredit' => false,
                'fo_attestationHypotheque' => true,
            ],
        ]);
    }
}
