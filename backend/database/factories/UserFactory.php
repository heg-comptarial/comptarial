<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'nom' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'motDePasse' => bcrypt('password'), // Mot de passe par défaut
            'localite' => $this->faker->city,
            'adresse' => $this->faker->address,
            'codePostal' => $this->faker->postcode,
            'numeroTelephone' => $this->faker->phoneNumber,
            'role' => $this->faker->randomElement(['admin', 'prive', 'entreprise']),
            'statut' => $this->faker->randomElement(['approved']),
            'dateCreation' => now(),
        ];
    }
}