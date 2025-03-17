<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User; // Add this to reference the User model
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Seed the client's table.
     */
    public function run(): void
    {
        // Make sure the user table has at least 10 users for the seeder to work
        $users = User::all(); 

        // Check if there are any users in the database
        if ($users->isEmpty()) {
            // If no users, you may want to seed users first
            // Seed users first
            $this->call(UserSeeder::class);
            $users = User::all();
        }

        // Now, for each user, create a client record with a valid user_id
        foreach ($users as $user) {
            Client::create([
                'type_entreprise' => 'SARL', // Example values, replace as necessary
                'adresse' => '962 Lang Inlet Suite 189 Walterburgh, MT 67763',
                'numero_fiscal' => '3555614465',
                'statut_client' => 'Suspendu',
                'user_id' => $user->id, // Ensure the client is linked to an existing user
            ]);
        }
    }
}

