<?php

namespace Database\Factories;

use App\Models\StatutClient;
use App\Models\Client; // Assurez-vous que vous avez bien importé le modèle Client
use Illuminate\Database\Eloquent\Factories\Factory;

class StatutClientFactory extends Factory
{
    protected $model = StatutClient::class;

    public function definition()
    {
        return [
            'client_id' => Client::factory(),  // Crée un client associé
            'statut' => $this->faker->randomElement(['Accepté', 'Suspendu', 'Refusé']),
            'date_statut' => $this->faker->dateTimeThisYear(),
        ];
    }
}
