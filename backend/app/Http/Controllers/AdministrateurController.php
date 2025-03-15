<?php

namespace App\Http\Controllers;

use App\Models\Administrateur;
use Illuminate\Http\Request;

class AdministrateurController extends Controller
{
    /**
     * Récupérer tous les administrateurs.
     */
    public function index()
    {
        $administrateurs = Administrateur::all();
        return response()->json($administrateurs);
    }
}
