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

// Problème Admin & Prive --> Relation ??!!

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
    public function test_user_has_many_administrateurs(): void
    {
        $user = User::factory()->create();
        Administrateur::factory()->create(['user_id' => $user->user_id]);

        $this->assertInstanceOf(Administrateur::class, $user->administrateurs->first());
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
        $this->assertInstanceOf(Administrateur::class, $user->administrateur);
        
        // Vérifie que l'ID de l'administrateur correspond à celui de l'utilisateur
        $this->assertEquals($administrateur->user_id, $user->user_id);
    }

    /**
     * Teste la relation User -> Entreprises.
     */
    public function test_user_has_many_entreprises(): void
    {
        $user = User::factory()->create();
        Entreprise::factory()->create(['user_id' => $user->user_id]);

        $this->assertInstanceOf(Entreprise::class, $user->entreprises->first());
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
    public function test_user_has_many_prives(): void
    {
        $user = User::factory()->create();
        Prive::factory()->create(['user_id' => $user->user_id]);

        $this->assertInstanceOf(Prive::class, $user->prives->first());
    }

}
