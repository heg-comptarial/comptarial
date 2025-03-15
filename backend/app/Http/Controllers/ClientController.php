<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;

class ClientController extends Controller
{
    /**
     * Récupérer tous les clients.
     */
    public function index()
    {
        $clients = Client::all();
        return response()->json($clients);
    }
}
