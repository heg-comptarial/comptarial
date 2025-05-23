<?php

namespace App\Http\Controllers;

use App\Models\Rubrique;
use Illuminate\Http\Request;

class RubriqueController extends Controller
{
    public function index()
    {
        // Récupère toutes les rubriques avec leurs relations
        $rubriques = Rubrique::with('declaration', 'documents')->get();
        return response()->json($rubriques);
    }

    public function store(Request $request)
    {
        // Valide les données
        $request->validate([
            'declaration_id' => 'required|exists:declaration,declaration_id',
            'titre' => 'required|string|max:255',
            'type' => 'required|string|max:255',
        ]);
    
        // Vérifie s'il existe déjà une rubrique avec le même titre pour cette déclaration
        $exists = Rubrique::where('declaration_id', $request->declaration_id)
            ->whereRaw('LOWER(TRIM(titre)) = ?', [strtolower(trim($request->titre))])
            ->exists();
    
        if ($exists) {
            return response()->json([
                'message' => 'Une rubrique avec ce titre existe déjà pour cette déclaration.'
            ], 409); // Conflit
        }
    
        // Crée la rubrique
        $rubrique = Rubrique::create($request->all());
        return response()->json($rubrique, 201);
    }

    public function show($id)
    {
        // Récupère une rubrique spécifique avec ses relations
        $rubrique = Rubrique::with('declaration', 'documents')->findOrFail($id);
        return response()->json($rubrique);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'titre' => 'string|max:255'
        ]);

        // Met à jour une rubrique
        $rubrique = Rubrique::findOrFail($id);
        $rubrique->update($request->all());
        return response()->json($rubrique);
    }

    public function destroy($id)
    {
        // Supprime une rubrique
        $rubrique = Rubrique::findOrFail($id);
        $rubrique->delete();
        return response()->json(null, 204);
    }
    public function getRubriqueByDeclarationID($id){
        $rubrique = Rubrique::where('declaration_id', $id)->get();

    if ($rubrique->isEmpty()) {
        return response()->json(['message' => 'Aucun rubrique trouvé pour ce privé'], 404);
    }

    return response()->json($rubrique);
    }
}