<?php

namespace App\Services;

use App\Models\Client;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class ClientService
{
    /**
     * Get all clients
     *
     * @return Collection
     */
    public function getAllClients(): Collection{
        return Client::with('user')->get();
    }

    /**
     * Get client by ID
     *
     * @param int $id
     * @return Client
     */
    public function getClientById(int $id): Client
    {
        return Client::findOrFail($id);
    }

    /**
     * Create a new client
     *
     * @param array $data
     * @return Client
     */
    public function createClient(array $data): Client
    {
        return Client::create($data);
    }

    /**
     * Update an existing client
     *
     * @param int $id
     * @param array $data
     * @return Client
     */
    public function updateClient(int $id, array $data): Client
    {
        $client = $this->getClientById($id);
        $client->update($data);
        
        return $client;
    }

    /**
     * Delete a client
     *
     * @param int $id
     * @return bool
     */
    public function deleteClient(int $id): bool
    {
        $client = $this->getClientById($id);
        return $client->delete();
    }

    /**
     * Validate client data
     *
     * @param Request $request
     * @param int|null $id
     * @return array
     */
    public function validateClientData(Request $request, ?int $id = null): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email' . ($id ? ',' . $id : ''),
            'phone' => 'required|string|max:20',
        ];

        // For updates, make fields optional
        if ($id) {
            $rules = [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:clients,email,' . $id,
                'phone' => 'sometimes|string|max:20',
            ];
        }

        return $request->validate($rules);
    }
}
