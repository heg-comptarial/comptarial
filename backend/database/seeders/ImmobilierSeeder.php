<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImmobilierSeeder extends Seeder
{
    public function run()
    {
        DB::table('immobilier')->insert([
            [
                'prive_id' => 3,
                'statut' => 'occupe',
                'canton' => 'Genève',
                'commune' => 'Genève',
                'pays' => 'Suisse',
                'noParcelleGeneve' => 'G123456',
                'adresseComplete' => '1 Rue de l’Immobilier',
                'anneeConstruction' => '1995',
                'occupeDesLe' => '2010-06-01',
                'dateAchat' => '2010-05-01',
                'pourcentageProprietaire' => 100.00,
                'autreProprietaire' => 'Aucun',
                'prixAchat' => 800000.00,
                'valeurLocativeBrut' => 20000.00,
                'loyersEncaisses' => 0.00,
                'fraisEntretienDeductibles' => 2000.00,
                'fo_bienImmobilier' => true,
                'fo_attestationValeurLocative' => true,
                'fo_taxeFonciereBiensEtranger' => false,
                'fo_factureEntretienImmeuble' => true,
            ],
        ]);
    }
}
