<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StatutClient;

class StatutClientController extends Controller
{
    /**
     * Récupérer tous les statuts des clients.
     */
    public function index()
    {
        $statutClients = StatutClient::all();
        return response()->json($statutClients);
    }
}
