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
    

    public function validerDeclarationEtDocuments($declarationId, Request $request)
    {
        try {
            // Récupérer la déclaration
            $declaration = Declaration::with('rubriques.documents')->findOrFail($declarationId);

            // Vérifier si la déclaration est déjà validée
            if ($declaration->statut === 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'La déclaration est déjà validée.',
                ], 400);
            }

            // Mettre à jour le statut de la déclaration
            $declaration->statut = 'approved';
            $declaration->save();

            // Mettre à jour le statut des documents associés
            foreach ($declaration->rubriques as $rubrique) {
                foreach ($rubrique->documents as $document) {
                    $document->statut = 'approved';
                    $document->save();
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Déclaration et documents validés avec succès.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la validation de la déclaration.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


}