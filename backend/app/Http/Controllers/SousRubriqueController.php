<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sousrubrique;

class SousRubriqueController extends Controller
{
    /**
     * Récupérer toutes les sous-rubriques.
     */
    public function index()
    {
        $sousRubriques = Sousrubrique::all();
        return response()->json($sousRubriques);
    }
}
