<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index()
    {
        // Récupère tous les documents avec leurs relations
        $documents = Document::with(['sous_rubrique', 'commentaires'])->get();
        return response()->json($documents);
    }

    public function store(Request $request)
    {
        // Valide les données
        $request->validate([
            'sous_rub_id' => 'required|exists:sous_rubrique,sous_rub_id',
            'titre' => 'required|string|max:255',
            'type' => 'required|in:pdf,doc,xls,ppt,image,other',
            'cheminFichier' => 'required|string|max:255',
            'statut' => 'required|in:pending,approved,rejected',
        ]);

        // Crée un nouveau document
        $document = Document::create($request->all());
        return response()->json($document, 201);
    }

    public function show($id)
    {
        // Récupère un document spécifique avec ses relations
        $document = Document::with(['sous_rubrique', 'commentaires'])->findOrFail($id);
        return response()->json($document);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'titre' => 'string|max:255',
            'type' => 'in:pdf,doc,xls,ppt,image,other',
            'cheminFichier' => 'string|max:255',
            'statut' => 'in:pending,approved,rejected',
        ]);

        // Met à jour un document
        $document = Document::findOrFail($id);
        $document->update($request->all());
        return response()->json($document);
    }

    public function destroy($id)
    {
        // Supprime un document
        $document = Document::findOrFail($id);
        $document->delete();
        return response()->json(null, 204);
    }
}