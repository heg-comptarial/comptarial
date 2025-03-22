<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Declaration;

class DeclarationController extends Controller
{
    /**
     * Récupérer toutes les déclarations.
     */
    public function index()
    {
        $declarations = Declaration::all();
        return response()->json($declarations);
    }
}
