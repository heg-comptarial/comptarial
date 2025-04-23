<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PensionAlimentaireSeeder extends Seeder
{
    public function run()
    {
        DB::table('pensionalimentaire')->insert([
            [
                'enfant_id' => 1,
                'statut' => 'verse',
                'montantContribution' => 800.00,
                'nom' => 'Durand',
                'prenom' => 'Paul',
                'noContribuable' => '7561234567890',
            ],
        ]);
    }
}
