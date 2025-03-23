<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommentaireSeeder extends Seeder
{
    public function run()
    {
        DB::table('commentaire')->insert([
            [
                'document_id' => 1,
                'admin_id' => 1,
                'contenu' => 'Ceci est un commentaire de test.',
                'dateCreation' => now(),
            ],
            [
                'document_id' => 2,
                'admin_id' => 2,
                'contenu' => 'Un autre commentaire pour tester.',
                'dateCreation' => now(),
            ],
            [
                'document_id' => 1,
                'admin_id' => 2,
                'contenu' => 'Encore un commentaire pour le document 1.',
                'dateCreation' => now(),
            ],
        ]);
    }
}