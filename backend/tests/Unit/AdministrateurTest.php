<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Administrateur;
use App\Models\User;
use App\Models\Document;
use App\Models\Rubrique;
use App\Models\Commentaire;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdministrateurTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test la création d'un Administrateur.
     */
    public function test_administrateur_can_be_created(): void
    {
        // Créer un utilisateur
        $user = User::factory()->create();

        // Créer un administrateur associé à l'utilisateur
        $administrateur = Administrateur::factory()->create([
            'user_id' => $user->user_id,
            'niveauAcces' => 'admin',
        ]);

        // Vérifier que l'administrateur existe bien en base de données
        $this->assertDatabaseHas('administrateur', [
            'user_id' => $user->user_id,
            'niveauAcces' => 'admin',
        ]);
    }

    /**
     * Test la relation entre Administrateur et User.
     */
    public function test_administrateur_belongs_to_user(): void
    {
        // Créer un utilisateur
        $user = User::factory()->create();

        // Créer un administrateur associé à cet utilisateur
        $administrateur = Administrateur::factory()->create([
            'user_id' => $user->user_id,
            'niveauAcces' => 'admin',
        ]);

        // Vérifier que l'administrateur appartient bien à l'utilisateur
        $this->assertInstanceOf(User::class, $administrateur->user);
        $this->assertEquals($user->user_id, $administrateur->user->user_id);
    }

    /**
     * Test qu'un Administrateur a plusieurs Commentaires.
     */
    public function test_administrateur_has_many_commentaires(): void
    {
        // Créer un utilisateur et un administrateur
        $user = User::factory()->create();
        $administrateur = Administrateur::factory()->create(['user_id' => $user->user_id]);
        $adminId = $administrateur->admin_id;

        // Créer une rubrique
        $rubrique = Rubrique::factory()->create();  // Créez une rubrique valide

        // Vérifiez que la rubrique a bien été créée et récupérez son ID
        $this->assertNotNull($rubrique->rubrique_id, 'Rubrique ID is null');
        $rubriqueId = $rubrique->rubrique_id;

        // Vérifier si la rubrique existe bien dans la base de données
        $this->assertDatabaseHas('rubrique', [
            'rubrique_id' => $rubriqueId
        ]);
        
        Log::info("Rubrique ID: " . $rubriqueId);  // Imprimer l'ID de la rubrique dans les logs pour vérification

        // Créer un document associé à cette rubrique
        $document = Document::factory()->create([
            'rubrique_id' => $rubriqueId,  // Utilisez une rubrique valide
        ]);

        // Vérifier que le document a bien le bon rubrique_id
        $this->assertEquals($rubriqueId, $document->rubrique_id, "Le rubrique_id du document ne correspond pas à celui de la rubrique");

        // Imprimer l'ID du document pour vérifier
        Log::info("Document Rubrique ID: " . $document->rubrique_id);  // Enregistrer dans le log l'ID de rubrique du document

        // Créer des commentaires associés à cet administrateur et à ce document
        $commentaire1 = Commentaire::factory()->create([
            'admin_id' => $administrateur->admin_id,  // Associer à l'administrateur
            'document_id' => $document->doc_id      // Associer à un document valide
        ]);
        
        $commentaire2 = Commentaire::factory()->create([
            'admin_id' => $administrateur->admin_id,  // Associer à l'administrateur
            'document_id' => $document->doc_id      // Associer à un document valide
        ]);

        // Vérifier que l'administrateur possède bien ces commentaires
        $this->assertCount(2, $administrateur->commentaires);
        $this->assertInstanceOf(Commentaire::class, $administrateur->commentaires->first());

        // Vérifier que les commentaires sont bien associés au document
        $this->assertEquals($document->doc_id, $commentaire1->document_id);
        $this->assertEquals($document->doc_id, $commentaire2->document_id);
    }

    /**
     * Test la valeur du niveau d'accès d'un Administrateur.
     */
    public function test_administrateur_level_of_access(): void
    {
        // Créer un utilisateur
        $user = User::factory()->create();

        // Créer un administrateur avec un niveau d'accès
        $administrateur = Administrateur::factory()->create([
            'user_id' => $user->user_id,
            'niveauAcces' => 'admin',
        ]);

        // Vérifier la valeur du niveauAcces
        $this->assertEquals('admin', $administrateur->niveauAcces);
    }

    /**
     * Test qu'un User ne peut avoir qu'un seul Administrateur.
     */
    public function test_user_cannot_have_multiple_administrateurs(): void
    {
        // Créer un utilisateur
        $user = User::factory()->create();

        // Créer un premier administrateur
        Administrateur::factory()->create(['user_id' => $user->user_id]);

        // Tenter de créer un deuxième administrateur pour le même utilisateur
        $this->expectException(\Illuminate\Database\QueryException::class);

        Administrateur::factory()->create(['user_id' => $user->user_id]);
    }
}
