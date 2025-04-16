<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index()
    {
        // Récupère tous les documents avec leurs relations
        $documents = Document::with(['rubrique', 'commentaires'])->get();
        return response()->json($documents);
    }

    public function store(Request $request)
    {
        $request->validate([
            'documents' => 'required|array',
            'documents.*.rubrique_id' => 'required|exists:Rubrique,rubrique_id',
            'documents.*.nom' => 'required|string|max:255',
            'documents.*.type' => 'required|in:pdf,doc,docx,xls,xlsx,ppt,pptx,jpeg,jpg,png,other',
            'documents.*.cheminFichier' => 'required|string',
            'documents.*.statut' => 'sometimes|in:pending,rejected,approved',
            'documents.*.sous_rubrique' => 'nullable|string',
        ]);

        $savedDocuments = [];
        
        foreach ($request->input('documents') as $documentData) {
            $document = Document::create([
                'rubrique_id' => $documentData['rubrique_id'],
                'nom' => $documentData['nom'],
                'type' => $documentData['type'],
                'cheminFichier' => $documentData['cheminFichier'],
                'statut' => $documentData['statut'] ?? 'pending',
                'sous_rubrique' => $documentData['sous_rubrique'] ?? null,
            ]);
            
            $savedDocuments[] = $document;
        }

        return response()->json([
            'success' => true,
            'savedCount' => count($savedDocuments),
            'documents' => $savedDocuments,
        ]);
    }


    public function show($id)
    {
        // Récupère un document spécifique avec ses relations
        $document = Document::with(['rubrique', 'commentaires'])->findOrFail($id);
        return response()->json($document);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'nom' => 'string|max:255',
            'type' => 'in:pdf,doc,docx,xls,xlsx,ppt,pptx,jpeg,jpg,png,other',
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

    public function getDocumentsByUser($userId)
    {
    // Récupère tous les documents liés à un utilisateur via les déclarations
    $documents = Document::whereHas('rubrique.declaration', function ($query) use ($userId) {
        $query->where('user_id', $userId);
    })->with(['rubrique.declaration'])->get();

    return response()->json($documents);
    }

    public function getCommentairesByDocument($documentId)
    {
        // Récupère tous les commentaires d'un document
        $document = Document::with('commentaires')->findOrFail($documentId);
        return response()->json($document->commentaires);
    }
}