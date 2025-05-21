<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Declaration;
use App\Mail\AdminUploadedDocumentMail;

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
        Log::info("TRYING TO DELETE DOCUMENT ID: $id");

        // Supprime un document
        $document = Document::findOrFail($id);
        if (!$document) {
            Log::warning("Document not found: $id");
            return response()->json(['error' => 'Document introuvable'], 404);
        }

        $document->commentaires()->delete(); // Supprime les commentaires associés

        $document->delete();
        Log::info("Document deleted: $id");

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


    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:validé,en_attente,refusé'
        ]);

        $document = Document::findOrFail($id);
        $document->statut = $request->statut;
        $document->save();

        return response()->json([
            'success' => true,
            'message' => 'Statut du document mis à jour.',
            'document' => $document
        ]);
    }
    
    public function getCommentairesByDocument($documentId)
    {
        // Récupère tous les commentaires d'un document
        $document = Document::with('commentaires.administrateur.user')->findOrFail($documentId);
        return response()->json($document->commentaires);
    }

    public function getDocumentsWithRubrique()
    {
        // Récupère tous les documents et inclut la relation 'rubrique'
        $documents = Document::with('rubrique')->get();

        return response()->json($documents);
    }

    public function notifyUserOfNewAdminDocument(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $declaration = Declaration::where('user_id', $user->user_id)
                                ->where('annee', $request->year)
                                ->where('titre', $request->title)
                                ->firstOrFail();

        Mail::to($user->email)->send(new AdminUploadedDocumentMail($user, $declaration));

        return response()->json(['message' => 'Mail envoyé à l’utilisateur.']);
    }
}