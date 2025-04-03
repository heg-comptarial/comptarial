<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Administrateur;
use App\Models\Declaration;
use App\Models\Entreprise;
use App\Models\Notification;
use App\Models\Prive;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;


class UserTest extends TestCase
{
    /**
     * A basic unit test example.
     */
    public function test_example(): void
    {
        $this->assertTrue(true);
    }


    /**
     * Teste la création d'un utilisateur.
     */
    public function test_user_can_be_created(): void
    {
        $user = User::factory()->create([
            'nom' => 'John Doe',
            'email' => 'john@example.com',
            'motDePasse' => bcrypt('password'),
            'localite' => 'Paris',
            'adresse' => '123 Rue de Test',
            'codePostal' => '75001',
            'numeroTelephone' => '0123456789',
            'role' => 'admin',
            'statut' => 'approved',
            'dateCreation' => now(),
        ]);

        $this->assertDatabaseHas('user', [
            'email' => 'john@example.com',
        ]);
    }


    /**
     * Teste la relation User -> Administrateur.
     */
    public function test_user_has_one_administrateur(): void
    {
        // Crée un utilisateur
        $user = User::factory()->create();

        // Crée un administrateur associé à cet utilisateur
        $administrateur = Administrateur::factory()->create(['user_id' => $user->user_id]);

        // Vérifie que l'administrateur associé est bien du type Administrateur
        $this->assertInstanceOf(Administrateur::class, $user->administrateurs);
        
        // Vérifie que l'ID de l'administrateur correspond à celui de l'utilisateur
        $this->assertEquals($administrateur->user_id, $user->user_id);
    }

    /**
     * Teste la relation User -> Entreprises.
     */
    public function test_user_has_one_entreprise(): void
    {
        // Créer un utilisateur
        $user = User::factory()->create([
            'statut' => 'approved',  // Assurez-vous que le statut est 'approved'
        ]);

        // Créer une entreprise associée à cet utilisateur
        $entreprise = Entreprise::factory()->create(['user_id' => $user->user_id]);

        // Vérifie que l'entreprise associée est bien du type Entreprise
        $this->assertInstanceOf(Entreprise::class, $user->entreprises);

        // Vérifie que l'ID de l'entreprise correspond à celui de l'utilisateur
        $this->assertEquals($entreprise->user_id, $user->user_id);
    }


    /**
     * Teste la relation User -> Notifications.
     */
    public function test_user_has_many_notifications(): void
    {
        $user = User::factory()->create();
        Notification::factory()->create(['user_id' => $user->user_id]);

        $this->assertInstanceOf(Notification::class, $user->notifications->first());
    }

    /**
     * Teste la relation User -> Prives.
     */
    public function test_user_has_one_prive(): void
    {
        // Créer un utilisateur
        $user = User::factory()->create();

        // Créer un privé associé à cet utilisateur
        $prive = Prive::factory()->create(['user_id' => $user->user_id]);

        // Vérifie que le privé associé est bien du type Prive
        $this->assertInstanceOf(Prive::class, $user->prives);

        // Vérifie que l'ID du privé correspond à celui de l'utilisateur
        $this->assertEquals($prive->user_id, $user->user_id);
    }
}
