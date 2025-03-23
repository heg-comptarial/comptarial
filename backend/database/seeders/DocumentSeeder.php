<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DocumentSeeder extends Seeder
{
    public function run()
    {
        DB::table('document')->insert([
            [
                'sous_rub_id' => 1,
                'titre' => 'Document 1',
                'type' => 'pdf',
                'cheminFichier' => 'documents/document1.pdf',
                'statut' => 'approved',
                'dateCreation' => now(),
            ],
            [
                'sous_rub_id' => 2,
                'titre' => 'Document 2',
                'type' => 'doc',
                'cheminFichier' => 'documents/document2.doc',
                'statut' => 'pending',
                'dateCreation' => now(),
            ],
            [
                'sous_rub_id' => 1,
                'titre' => 'Document 3',
                'type' => 'image',
                'cheminFichier' => 'documents/image1.png',
                'statut' => 'rejected',
                'dateCreation' => now(),
            ],
        ]);
    }
}