<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
           'rubrique_id' => $this->faker->numberBetween(1, 10),
            'nom' => $this->faker->word,
            'type' => $this->faker->randomElement(['pdf', 'doc', 'jpg']),
            'cheminFichier' => $this->faker->filePath(),
            'statut' => $this->faker->randomElement(['approved', 'pending', 'rejected']),
            'sous_rubrique' => $this->faker->word,
            'dateCreation' => now(),
        ];
    }
}
