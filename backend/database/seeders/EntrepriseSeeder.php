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
                'raisonSociale' => 'Entreprise Alpha',
                'prestations' => 'Consulting',
                'grandLivre' => 'grand_livre_alpha.pdf',
                'numeroFiscal' => 'FR123456789',
                'nouvelleEntreprise' => true,
            ],
        ]);
    }
}