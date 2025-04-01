<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Notification;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
           'user_id' => User::factory(), // Associe un utilisateur à la notification
            'contenu' => $this->faker->sentence, // Contenu de la notification (phrase aléatoire)
            'dateCreation' => $this->faker->dateTimeThisYear, // Génère une date aléatoire cette année
        ];
    }
}
