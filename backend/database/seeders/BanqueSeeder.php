<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BanqueSeeder extends Seeder
{
    public function run()
    {
        DB::table('banque')->insert([
            [
                'prive_id' => 3,
                'fo_attestationFinAnnee' => true,
            ],
        ]);
    }
}
