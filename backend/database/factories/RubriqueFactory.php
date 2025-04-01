<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Declaration;
use App\Models\Rubrique;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rubrique>
 */
class RubriqueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
           'declaration_id' => Declaration::factory(), // Associe une rubrique à une déclaration
            'titre' => $this->faker->sentence(), // Génère un titre aléatoire
            'description' => $this->faker->text(), // Génère une description aléatoire
        ];
    }
}
