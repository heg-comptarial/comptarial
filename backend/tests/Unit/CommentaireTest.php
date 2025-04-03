<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Commentaire;
use App\Models\Document;
use App\Models\Administrateur;
use App\Models\Rubrique;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CommentaireTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test qu'un commentaire peut être créé.
     */
    public function test_commentaire_can_be_created(): void
    {
        // Création d'une rubrique
        $rubrique = Rubrique::factory()->create();

        // Création d'un administrateur
        $admin = Administrateur::factory()->create();

        // Création d'un document lié à la rubrique et à l'administrateur
        $document = Document::factory()->create([
            'rubrique_id' => $rubrique->rubrique_id, // Assurez-vous que ce lien est valide
            'type' => 'pdf', // Assurez-vous que ce type est autorisé
            'statut' => 'approved', // Assurez-vous que ce statut est valide
        ]);

        // Création d'un commentaire
        $commentaire = Commentaire::factory()->create([
            'document_id' => $document->doc_id,
            'admin_id' => $admin->admin_id,
            'contenu' => 'Ceci est un commentaire de test.',
        ]);

        // Vérification dans la base de données
        $this->assertDatabaseHas('commentaire', [
            'document_id' => $document->doc_id,
            'admin_id' => $admin->admin_id,
            'contenu' => 'Ceci est un commentaire de test.',
        ]);
    }

    /**
     * Test la relation entre Commentaire et Document.
     */
    public function test_commentaire_belongs_to_document(): void
    {
        // Création d'une rubrique
        $rubrique = Rubrique::factory()->create();

        // Création d'un document lié à la rubrique
        $document = Document::factory()->create([
            'rubrique_id' => $rubrique->rubrique_id, // Assurez-vous que ce lien est valide
            'type' => 'pdf', // Assurez-vous que ce type est autorisé
            'statut' => 'approved', // Assurez-vous que ce statut est valide
        ]);

        // Création d'un commentaire
        $commentaire = Commentaire::factory()->create(['document_id' => $document->doc_id]);

        // Vérification de la relation
        $this->assertInstanceOf(Document::class, $commentaire->document);
        $this->assertEquals($document->doc_id, $commentaire->document->doc_id);
    }

    /**
     * Test la relation entre Commentaire et Administrateur.
     */
    public function test_commentaire_belongs_to_administrateur(): void
    {
        // Création d'une rubrique pour éviter l'erreur de clé étrangère
        $rubrique = Rubrique::factory()->create();

        // Création d'un document lié à la rubrique
        $document = Document::factory()->create([
            'rubrique_id' => $rubrique->rubrique_id, // On s'assure que la rubrique existe
            'type' => 'pdf', // Vérifie que le type est valide
            'statut' => 'approved', // Vérifie que le statut est valide
        ]);

        // Création d'un administrateur
        $admin = Administrateur::factory()->create();

        // Création d'un commentaire lié à l'administrateur et au document
        $commentaire = Commentaire::factory()->create([
            'document_id' => $document->doc_id,
            'admin_id' => $admin->admin_id, // Vérifie que l'admin_id existe
        ]);

        // Vérification de la relation
        $this->assertInstanceOf(Administrateur::class, $commentaire->administrateur);
        $this->assertEquals($admin->admin_id, $commentaire->administrateur->admin_id);
    }

}
