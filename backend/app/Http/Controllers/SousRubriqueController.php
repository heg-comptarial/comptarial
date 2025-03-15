<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SousRubrique;

class SousRubriqueController extends Controller
{
    /**
     * Récupérer toutes les sous-rubriques.
     */
    public function index()
    {
        $sousRubriques = SousRubrique::all();
        return response()->json($sousRubriques);
    }
}
