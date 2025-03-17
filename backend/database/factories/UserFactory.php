<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(), // Génère un nom aléatoire
            'email' => $this->faker->unique()->safeEmail(), // Génère un email unique
            'email_verified_at' => now(), // Attribue une date de vérification
            'password' => Hash::make('password'), // Hache le mot de passe
            'remember_token' => Str::random(10),
            'mot_de_passe' => 'password', // Le mot de passe en clair
            'date_creation' => now(),
            'localite' => $this->faker->city(),
            'adresse' => $this->faker->address(),
            'code_postal' => $this->faker->postcode(),
            'numero_telephone' => $this->faker->phoneNumber(),
            'role' => $this->faker->randomElement(['admin', 'client_prive', 'client_entreprise']), // Attribue un rôle aléatoire
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
