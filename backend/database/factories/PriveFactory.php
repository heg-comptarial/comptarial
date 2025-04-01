<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Prive;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Prive>
 */
class PriveFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // Associe un utilisateur à la table "prive"
            'dateNaissance' => $this->faker->dateOfBirth, // Génère une date de naissance aléatoire
            'nationalite' => $this->faker->country, // Génère une nationalité aléatoire
            'etatCivil' => $this->faker->randomElement(['Célibataire', 'Marié', 'Divorcé', 'Veuf']), // Génère un état civil aléatoire
            'fo_banques' => $this->faker->boolean, // Génère une valeur booléenne aléatoire
            'fo_dettes' => $this->faker->boolean,
            'fo_immobiliers' => $this->faker->boolean,
            'fo_salarie' => $this->faker->boolean,
            'fo_autrePersonneCharge' => $this->faker->boolean,
            'fo_independant' => $this->faker->boolean,
            'fo_rentier' => $this->faker->boolean,
            'fo_autreRevenu' => $this->faker->boolean,
            'fo_assurance' => $this->faker->boolean,
            'fo_autreDeduction' => $this->faker->boolean,
            'fo_autreInformations' => $this->faker->boolean,
        ];
    }
}
