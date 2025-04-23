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
        $this->call(DocumentSeeder::class);
        $this->call(CommentaireSeeder::class);
        $this->call(PensionAlimentaireSeeder::class);
        $this->call(AutrePersonneAChargeSeeder::class);
        $this->call(RevenuSeeder::class);
        $this->call(RentierSeeder::class);
        $this->call(BanqueSeeder::class);
        $this->call(TitreSeeder::class);
        $this->call(ImmobilierSeeder::class);
        $this->call(InteretDettesSeeder::class);
        $this->call(DeductionSeeder::class);
        $this->call(AutreInformationsSeeder::class);
        $this->call(IndemniteAssuranceSeeder::class);
    }
}
