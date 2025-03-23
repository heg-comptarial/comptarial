<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UserSeeder::class);
        $this->call(PriveSeeder::class);
        $this->call(ConjointSeeder::class);
        $this->call(EnfantSeeder::class);
        $this->call(EntrepriseSeeder::class);
        $this->call(NotificationSeeder::class);
        $this->call(AdministrateurSeeder::class);
        $this->call(DeclarationSeeder::class);
        $this->call(RubriqueSeeder::class);
        $this->call(SousRubriqueSeeder::class);
        $this->call(DocumentSeeder::class);
        $this->call(CommentaireSeeder::class);
    }
}
