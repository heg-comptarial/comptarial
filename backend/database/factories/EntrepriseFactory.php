<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Entreprise;
use App\Models\User;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Entreprise>
 */
class EntrepriseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // Associe un utilisateur à l'entreprise
            'raisonSociale' => $this->faker->company, // Génère une raison sociale (nom de l'entreprise)
            'prestations' => $this->faker->sentence, // Génère une prestation aléatoire
            'grandLivre' => $this->faker->word, // Génère un grand livre fictif
            'numeroFiscal' => $this->faker->unique()->numerify('FR###########'), // Génère un numéro fiscal fictif
            'nouvelleEntreprise' => $this->faker->boolean, // Génère un booléen pour savoir si l'entreprise est nouvelle
        ];
    }
}
