<?php

namespace App\Http\Controllers;

use App\Models\Commentaire;
use Illuminate\Http\Request;

class CommentaireController extends Controller
{
    public function index()
    {
        // Récupère tous les commentaires
        $commentaires = Commentaire::with(['document', 'administrateur'])->get();
        return response()->json($commentaires);
    }

    public function store(Request $request)
    {
        // Valide les données
        $request->validate([
            'document_id' => 'required|exists:document,doc_id',
            'admin_id' => 'required|exists:administrateur,admin_id',
            'contenu' => 'required|string|max:255',
        ]);

        // Crée un nouveau commentaire
        $commentaire = Commentaire::create($request->all());
        return response()->json($commentaire, 201);
    }

    public function show($id)
    {
        // Récupère un commentaire spécifique
        $commentaire = Commentaire::with(['document', 'administrateur'])->findOrFail($id);
        return response()->json($commentaire);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'contenu' => 'string|max:255',
        ]);

        // Met à jour un commentaire
        $commentaire = Commentaire::findOrFail($id);
        $commentaire->update($request->all());
        return response()->json($commentaire);
    }

    public function destroy($id)
    {
        // Supprime un commentaire
        $commentaire = Commentaire::findOrFail($id);
        $commentaire->delete();
        return response()->json(null, 204);
    }
}