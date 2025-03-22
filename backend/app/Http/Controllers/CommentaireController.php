<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commentaire;

class CommentaireController extends Controller
{
    /**
     * Récupérer tous les commentaires.
     */
    public function index()
    {
        $commentaires = Commentaire::all();
        return response()->json($commentaires);
    }
}
