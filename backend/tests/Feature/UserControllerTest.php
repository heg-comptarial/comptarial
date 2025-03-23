<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_users()
    {
        // Crée des utilisateurs fictifs
        User::factory()->count(3)->create();

        // Appelle l'endpoint index
        $response = $this->getJson('/api/users');

        // Vérifie que la réponse est correcte
        $response->assertStatus(200);
        $response->assertJsonCount(3); // Vérifie qu'il y a 3 utilisateurs
    }

    public function test_store_creates_user()
    {
        // Données pour un nouvel utilisateur
        $data = [
            'nom' => 'Test User',
            'email' => 'test@example.com',
            'motDePasse' => 'password123',
            'localite' => 'Paris',
            'adresse' => '123 Rue de Paris',
            'codePostal' => '75001',
            'numeroTelephone' => '0123456789',
            'role' => 'prive',
            'statut' => 'approved',
        ];

        // Appelle l'endpoint store
        $response = $this->postJson('/api/users', $data);

        // Vérifie que l'utilisateur a été créé
        $response->assertStatus(201);
        $this->assertDatabaseHas('user', ['email' => 'test@example.com']);
    }

    public function test_show_returns_user()
    {
        // Crée un utilisateur fictif
        $user = User::factory()->create();

        // Appelle l'endpoint show
        $response = $this->getJson("/api/users/{$user->user_id}");

        // Vérifie que la réponse est correcte
        $response->assertStatus(200);
        $response->assertJson(['email' => $user->email]);
    }

    public function test_update_modifies_user()
    {
        // Crée un utilisateur fictif
        $user = User::factory()->create();

        // Données pour la mise à jour
        $data = [
            'nom' => 'Updated Name',
        ];

        // Appelle l'endpoint update
        $response = $this->putJson("/api/users/{$user->user_id}", $data);

        // Vérifie que l'utilisateur a été mis à jour
        $response->assertStatus(200);
        $this->assertDatabaseHas('user', ['nom' => 'Updated Name']);
    }

    public function test_destroy_deletes_user()
    {
        // Crée un utilisateur fictif
        $user = User::factory()->create();

        // Appelle l'endpoint destroy
        $response = $this->deleteJson("/api/users/{$user->user_id}");

        // Vérifie que l'utilisateur a été supprimé
        $response->assertStatus(204);
        $this->assertDatabaseMissing('user', ['user_id' => $user->user_id]);
    }
}