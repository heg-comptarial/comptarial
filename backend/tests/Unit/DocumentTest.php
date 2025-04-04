<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Document;
use App\Models\Rubrique;
use App\Models\Commentaire;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\QueryException;
use PHPUnit\Framework\Attributes\Test;

class DocumentTest extends TestCase
{

    use RefreshDatabase;

    /**
     * A basic unit test example.
     */
    public function test_example(): void
    {
        $this->assertTrue(true);
    }

    /** @test */
    public function it_belongs_to_a_rubrique()
    {
        $rubrique = Rubrique::factory()->create();
        $document = Document::factory()->create(['rubrique_id' => $rubrique->rubrique_id]);

        $this->assertInstanceOf(Rubrique::class, $document->rubrique);
    }

    /** @test */
    public function test_it_can_create_a_document()
    {
        $rubrique = Rubrique::factory()->create();
        $document = Document::factory()->create(['rubrique_id' => $rubrique->rubrique_id]);

        $this->assertDatabaseHas('document', [
            'doc_id' => $document->doc_id,
            'nom' => $document->nom,
        ]);
    }

    /** @test */
    public function test_it_belongs_to_a_rubrique()
    {
        $rubrique = Rubrique::factory()->create();
        $document = Document::factory()->create(['rubrique_id' => $rubrique->rubrique_id]);

        $this->assertEquals($rubrique->rubrique_id, $document->rubrique->rubrique_id);
    }

    /** @test */
    public function test_it_has_many_commentaires()
    {
        $rubrique = Rubrique::factory()->create(); // Ajout de la rubrique
        $document = Document::factory()->create(['rubrique_id' => $rubrique->rubrique_id]); // Associer correctement le document
        $commentaire = Commentaire::factory()->create(['document_id' => $document->doc_id]);

        $this->assertTrue($document->commentaires->contains($commentaire));
    }


}
