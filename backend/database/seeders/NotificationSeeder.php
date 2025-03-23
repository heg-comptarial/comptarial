<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        DB::table('notification')->insert([
            [
                'user_id' => 1,
                'contenu' => 'Votre déclaration a été approuvée.',
                'dateCreation' => now(),
            ],
            [
                'user_id' => 2,
                'contenu' => 'Un nouveau document a été ajouté.',
                'dateCreation' => now(),
            ],
            [
                'user_id' => 1,
                'contenu' => 'Votre compte a été mis à jour.',
                'dateCreation' => now(),
            ],
        ]);
    }
}