<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Administrateur;
use App\Models\User;


class AdministrateurControllerTest extends TestCase
{

    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_index_returns_all_administrateurs()
    {
        Administrateur::factory(3)->create();

        $response = $this->getJson('/api/administrateurs');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    public function test_store_creates_new_administrateur()
    {
        $user = User::factory()->create();

        $data = [
            'user_id' => $user->user_id,
            'niveauAcces' => 'admin',
        ];

        $response = $this->postJson('/api/administrateurs', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['user_id' => $user->user_id]);
    }

    public function test_show_returns_administrateur()
    {
        $administrateur = Administrateur::factory()->create();

        $response = $this->getJson("/api/administrateurs/{$administrateur->admin_id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['admin_id' => $administrateur->admin_id]);
    }

    public function test_update_modifies_administrateur()
    {
        $administrateur = Administrateur::factory()->create();

        $data = ['niveauAcces' => 'super_admin'];

        $response = $this->putJson("/api/administrateurs/{$administrateur->admin_id}", $data);

        $response->assertStatus(200)
                 ->assertJsonFragment($data);
    }

    public function test_destroy_deletes_administrateur()
    {
        $administrateur = Administrateur::factory()->create();

        $response = $this->deleteJson("/api/administrateurs/{$administrateur->admin_id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('administrateur', ['admin_id' => $administrateur->admin_id]);
    }

}
