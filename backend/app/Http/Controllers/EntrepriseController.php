<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entreprise;

class EntrepriseController extends Controller
{
    /**
     * Récupérer toutes les entreprises.
     */
    public function index()
    {
        $entreprises = Entreprise::all();
        return response()->json($entreprises);
    }
}
