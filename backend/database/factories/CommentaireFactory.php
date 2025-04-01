<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Commentaire;
use App\Models\Document;
use App\Models\Administrateur;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Commentaire>
 */
class CommentaireFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'document_id' => Document::factory(), // Associe un document à la table commentaire
            'admin_id' => Administrateur::factory(), // Associe un administrateur à la table commentaire
            'contenu' => $this->faker->text(200), // Génère un contenu de commentaire aléatoire
            'dateCreation' => $this->faker->dateTimeThisYear(), // Génère une date de création aléatoire (dans l'année en cours)
        ];
    }
}
