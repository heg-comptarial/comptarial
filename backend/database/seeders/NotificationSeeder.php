<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $notifications = [
            [
                'utilisateur_id' => 1, // Assure-toi que l'utilisateur avec ID 1 existe
                'type_notif' => 'Nouveau message',
                'contenu' => 'Vous avez un nouveau message concernant votre déclaration.',
            ],
            [
                'utilisateur_id' => 2, // Assure-toi que l'utilisateur avec ID 2 existe
                'type_notif' => 'Erreur de soumission',
                'contenu' => 'Il y a une erreur dans la déclaration soumise.',
            ],
        ];

        // Insérer les notifications dans la base de données
        DB::table('notification')->insert($notifications);
    }
}
