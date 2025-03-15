<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommentaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $commentaires = [
            [
                'doc_id' => 1, // Assure-toi que le document avec ID 1 existe
                'admin_id' => 1, // Assure-toi que l'administrateur avec ID 1 existe
                'contenu' => 'Vérifier les informations dans ce document.',
            ],
            [
                'doc_id' => 2, // Assure-toi que le document avec ID 2 existe
                'admin_id' => 2, // Assure-toi que l'administrateur avec ID 2 existe
                'contenu' => 'Documents incomplets, besoin d\'ajouter plus de détails.',
            ],
        ];

        // Insérer les commentaires dans la base de données
        DB::table('commentaire')->insert($commentaires);
    }
}
