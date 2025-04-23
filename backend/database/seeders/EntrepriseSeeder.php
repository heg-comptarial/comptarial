<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EntrepriseSeeder extends Seeder
{
    public function run()
    {
        DB::table('entreprise')->insert([
            [
                'user_id' => 3,
            ],
            [
                'user_id' => 8,
            ],
        ]);
    }
}