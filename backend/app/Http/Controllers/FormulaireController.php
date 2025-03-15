<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Formulaire;

class FormulaireController extends Controller
{
    /**
     * Récupérer tous les formulaires.
     */
    public function index()
    {
        $formulaires = Formulaire::all();
        return response()->json($formulaires);
    }
}
