<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rubrique;

class RubriqueController extends Controller
{
    /**
     * Récupérer toutes les rubriques.
     */
    public function index()
    {
        $rubriques = Rubrique::all();
        return response()->json($rubriques);
    }
}
