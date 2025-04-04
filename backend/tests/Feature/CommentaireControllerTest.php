<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\Commentaire;
use App\Models\Administrateur;
use App\Models\Rubrique;
use App\Models\Document;
use Tests\TestCase;

class CommentaireControllerTest extends TestCase
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

    public function test_index_returns_all_commentaires()
    {
        Commentaire::factory(3)->create();

        $response = $this->getJson('/api/commentaires');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    public function test_store_creates_new_commentaire()
    {
        $document = Document::factory()->create();
        $administrateur = Administrateur::factory()->create();

        $data = [
            'document_id' => $document->doc_id,
            'admin_id' => $administrateur->admin_id,
            'contenu' => 'Un commentaire test',
        ];

        $response = $this->postJson('/api/commentaires', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['contenu' => 'Un commentaire test']);
    }

    public function test_show_returns_commentaire()
    {
        $commentaire = Commentaire::factory()->create();

        $response = $this->getJson("/api/commentaires/{$commentaire->commentaire_id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['commentaire_id' => $commentaire->commentaire_id]);
    }

    public function test_update_modifies_commentaire()
    {
        $commentaire = Commentaire::factory()->create();

        $data = ['contenu' => 'Un commentaire modifié'];

        $response = $this->putJson("/api/commentaires/{$commentaire->commentaire_id}", $data);

        $response->assertStatus(200)
                 ->assertJsonFragment(['contenu' => 'Un commentaire modifié']);
    }

    public function test_destroy_deletes_commentaire()
    {
        $commentaire = Commentaire::factory()->create();

        $response = $this->deleteJson("/api/commentaires/{$commentaire->commentaire_id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('commentaire', ['commentaire_id' => $commentaire->commentaire_id]);
    }

}
