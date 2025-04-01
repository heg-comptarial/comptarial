<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Conjoint;
use App\Models\Prive;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Conjoint>
 */
class ConjointFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'prive_id' => Prive::factory(), // Associe un conjoint à un utilisateur privé existant
            'nom' => $this->faker->lastName(), // Génère un nom de famille
            'prenom' => $this->faker->firstName(), // Génère un prénom
            'nationalite' => $this->faker->country(), // Génère une nationalité
            'dateNaissance' => $this->faker->dateOfBirth(), // Génère une date de naissance
            'localite' => $this->faker->city(), // Génère une ville
            'adresse' => $this->faker->address(), // Génère une adresse
            'codePostal' => $this->faker->postcode(), // Génère un code postal
            'situationProfessionnelle' => $this->faker->jobTitle(), // Génère une situation professionnelle
        ];
    }
}
