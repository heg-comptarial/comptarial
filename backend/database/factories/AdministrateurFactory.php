<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Administrateur;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Administrateur>
 */
class AdministrateurFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // Crée un utilisateur lié à cet administrateur
            'niveauAcces' => $this->faker->randomElement(['admin', 'superadmin', 'moderator']), // Exemple de valeurs pour niveauAcces
        ];
    }
}
