<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $notifications = [
            [
                'user_id' => 1, // Assure-toi que l'utilisateur avec ID 1 existe
                'contenu' => 'Vous avez un nouveau message concernant votre déclaration.',
                'dateCreation' => Carbon::now(),
            ],
            [
                'user_id' => 2, // Assure-toi que l'utilisateur avec ID 2 existe
                'contenu' => 'Il y a une erreur dans la déclaration soumise.',
                'dateCreation' => Carbon::now(),
            ],
        ];

        // Insérer les notifications dans la base de données
        DB::table('notification')->insert($notifications);
    }
}
