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
                'rubrique_id' => 1,
                'nom' => 'Document 1',
                'type' => 'pdf',
                'cheminFichier' => 'documents/document1.pdf',
                'statut' => 'approved',
                'sous_rubrique' => 'test',
                'dateCreation' => now(),
            ],
            [
                'rubrique_id' => 2,
                'nom' => 'Document 2',
                'type' => 'doc',
                'cheminFichier' => 'documents/document2.doc',
                'statut' => 'pending',
                'sous_rubrique' => 'test',
                'dateCreation' => now(),
            ],
            [
                'rubrique_id' => 3,
                'nom' => 'Document 3',
                'type' => 'jpg',
                'cheminFichier' => 'documents/image1.png',
                'statut' => 'rejected',
                'sous_rubrique' => 'test',
                'dateCreation' => now(),
            ],
        ]);
    }
}