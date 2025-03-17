<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\User;  // Ensure User model is imported
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'type_entreprise' => $this->faker->randomElement(['SASU', 'SARL', 'SCI']),
            'adresse' => $this->faker->address,
            'numero_fiscal' => $this->faker->numerify('##########'),
            'statut_client' => $this->faker->randomElement(['Accepté', 'Suspendu', 'Refusé']),
            'user_id' => User::factory(),  // Link to an existing user by creating a User first
        ];
    }
}
