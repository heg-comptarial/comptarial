<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Declaration;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Declaration>
 */
class DeclarationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // Associe un utilisateur à la déclaration
            'titre' => $this->faker->sentence, // Génère un titre aléatoire
            'statut' => $this->faker->randomElement(['pending', 'approved', 'rejected']), // Statut aléatoire
            'annee' => $this->faker->year, // Génère une année aléatoire
            'dateCreation' => $this->faker->dateTimeThisDecade, // Génère une date de création aléatoire dans cette décennie
        ];
    }
}
