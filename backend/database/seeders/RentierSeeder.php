<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RentierSeeder extends Seeder
{
    public function run()
    {
        DB::table('rentier')->insert([
            [
                'prive_id' => 3,
                'fo_attestationRenteAVSAI' => true,
                'fo_attestationRentePrevoyance' => true,
                'fo_autresRentes' => false,
            ],
        ]);
    }
}
