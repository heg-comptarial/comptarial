<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $documents = [
            [
                'sous_rub_id' => 1, // Assure-toi que la sous-rubrique avec ID 1 existe
                'titre' => 'Document 1',
                'type' => 'PDF',
                'cheminFichier' => '/chemin/vers/le/fichier1.pdf',
                'statut' => 'Validé',
                'dateCreation' => Carbon::now(),
            ],
            [
                'sous_rub_id' => 2, // Assure-toi que la sous-rubrique avec ID 2 existe
                'titre' => 'Document 2',
                'type' => 'Word',
                'cheminFichier' => '/chemin/vers/le/fichier2.docx',
                'statut' => 'En attente',
                'dateCreation' => Carbon::now(),
            ],
        ];

        // Insérer les documents dans la base de données
        DB::table('document')->insert($documents);
    }
}
