<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Enfant;
use App\Models\Prive;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Enfant>
 */
class EnfantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'prive_id' => Prive::factory(), // Associe un enfant à un utilisateur privé
            'nom' => $this->faker->lastName(), // Génère un nom de famille
            'prenom' => $this->faker->firstName(), // Génère un prénom
            'dateNaissance' => $this->faker->dateOfBirth(), // Génère une date de naissance
            'adresse' => $this->faker->address(), // Génère une adresse
            'codePostal' => $this->faker->postcode(), // Génère un code postal
            'localite' => $this->faker->city(), // Génère une ville
            'noAVS' => $this->faker->regexify('[0-9]{9}'), // Génère un numéro AVS fictif
            'noContribuable' => $this->faker->regexify('[A-Z]{2}[0-9]{10}'), // Génère un numéro de contribuable fictif
            'revenuBrut' => $this->faker->randomFloat(2, 15000, 100000), // Génère un revenu brut entre 15,000 et 100,000
            'fortuneNet' => $this->faker->randomFloat(2, 5000, 50000), // Génère une fortune nette entre 5,000 et 50,000
        ];
    }
}
