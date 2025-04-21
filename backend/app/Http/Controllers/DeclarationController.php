<?php

namespace App\Http\Controllers;

use App\Models\Declaration;
use Illuminate\Http\Request;

class DeclarationController extends Controller
{
    public function index()
    {
        // Récupère toutes les déclarations avec leurs relations
        $declarations = Declaration::with('user', 'rubriques')->get();
        return response()->json($declarations);
    }

    public function store(Request $request)
    {
        // Valide les données
        $request->validate([
            'user_id' => 'required|exists:user,user_id',
            'titre' => 'required|string|max:255',
            'statut' => 'required|in:pending,approved,rejected',
            'annee' => 'required|string|size:4',
        ]);

        // Crée une nouvelle déclaration
        $declaration = Declaration::create($request->all());
        return response()->json($declaration, 201);
    }

    public function show($id)
    {
        // Récupère une déclaration spécifique avec ses relations
        $declaration = Declaration::with('user', 'rubriques')->findOrFail($id);
        return response()->json($declaration);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'titre' => 'string|max:255',
            'statut' => 'in:pending,approved,rejected',
            'annee' => 'string|size:4',
        ]);

        // Met à jour une déclaration
        $declaration = Declaration::findOrFail($id);
        $declaration->update($request->all());
        return response()->json($declaration);
    }

    public function destroy($id)
    {
        // Supprime une déclaration
        $declaration = Declaration::findOrFail($id);
        $declaration->delete();
        return response()->json(null, 204);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:approved,pending,rejected',
        ]);

        $declaration = Declaration::with('rubriques.documents')
            ->where('declaration_id', $id)
            ->firstOrFail();

        if ($request->statut === 'approved') {
            $documentsNonValidés = [];

            foreach ($declaration->rubriques as $rubrique) {
                foreach ($rubrique->documents as $doc) {
                    if ($doc->statut !== 'validé') {
                        $documentsNonValidés[] = $doc->nom ?? 'Document sans nom';
                    }
                }

                if ($rubrique->relationLoaded('sousRubriques')) {
                    foreach ($rubrique->sousRubriques as $sousRubrique) {
                        foreach ($sousRubrique->documents as $doc) {
                            if ($doc->statut !== 'validé') {
                                $documentsNonValidés[] = $doc->nom ?? 'Document SR sans nom';
                            }
                        }
                    }
                }
            }

            if (count($documentsNonValidés) > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de valider la déclaration. Certains documents ne sont pas validés.',
                    'documents_non_valides' => $documentsNonValidés,
                ], 422);
            }
        }

        $declaration->statut = $request->statut;
        $declaration->save();

        return response()->json([
            'success' => true,
            'message' => 'Statut de la déclaration mis à jour avec succès.',
            'declaration' => $declaration,
        ]);
    }

    public function checkDocuments($id)
    {
        // Récupérer la déclaration avec ses rubriques et documents
        $declaration = Declaration::with(['rubriques.documents'])
            ->where('declaration_id', $id)
            ->firstOrFail();
        
        $documentsNonValides = [];
        $allDocumentsApproved = true;
        
        // Parcourir toutes les rubriques et leurs documents
        foreach ($declaration->rubriques as $rubrique) {
            // Vérifier les documents de la rubrique
            if ($rubrique->documents) {
                foreach ($rubrique->documents as $doc) {
                    if ($doc->statut !== 'approved') {
                        $documentsNonValides[] = $doc->nom . ' (' . ($rubrique->nom ?? $rubrique->titre) . ')';
                        $allDocumentsApproved = false;
                    }
                }
            }
        }
        
        return response()->json([
            'all_documents_approved' => $allDocumentsApproved,
            'documents_non_valides' => $documentsNonValides
        ]);
    }


}