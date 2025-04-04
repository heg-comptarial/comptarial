<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Rubrique;


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
        // Créer une rubrique pour s'assurer que la clé étrangère existe
        $rubrique = Rubrique::factory()->create();

        return [
           'rubrique_id' => $rubrique->rubrique_id, // Utilise la rubrique créée
            'nom' => $this->faker->word,
            'type' => $this->faker->randomElement(['pdf', 'doc', 'jpg']),
            'cheminFichier' => $this->faker->filePath(),
            'statut' => $this->faker->randomElement(['approved', 'pending', 'rejected']),
            'sous_rubrique' => $this->faker->word,
            'dateCreation' => now(),
        ];
    }
}
