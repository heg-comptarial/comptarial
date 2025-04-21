<?php

namespace App\Http\Controllers;

use App\Models\Commentaire;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class CommentaireController extends Controller
{
    public function index()
    {
        // Récupère tous les commentaires
        $commentaires = Commentaire::with(['document', 'administrateur'])->get();
        return response()->json($commentaires);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'document_id' => 'required|exists:document,doc_id',
            'admin_id' => 'required|exists:administrateur,admin_id',
            'contenu' => 'required|string',
        ]);

        $commentaire = new Commentaire();
        $commentaire->document_id = $request->document_id;
        $commentaire->admin_id = $request->admin_id;
        $commentaire->contenu = $request->contenu;
        $commentaire->dateCreation = Carbon::now();
        $commentaire->save();

        return response()->json([
            'success' => true,
            'message' => 'Commentaire ajouté avec succès',
            'commentaire' => $commentaire
        ], 201);
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