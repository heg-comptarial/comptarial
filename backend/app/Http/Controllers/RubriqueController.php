<?php

namespace App\Http\Controllers;

use App\Models\Rubrique;
use Illuminate\Http\Request;

class RubriqueController extends Controller
{
    public function index()
    {
        // Récupère toutes les rubriques avec leurs relations
        $rubriques = Rubrique::with('declaration', 'sous_rubriques')->get();
        return response()->json($rubriques);
    }

    public function store(Request $request)
    {
        // Valide les données
        $request->validate([
            'declaration_id' => 'required|exists:declaration,declaration_id',
            'titre' => 'required|string|max:255',
            'description' => 'required|string|max:500',
        ]);

        // Crée une nouvelle rubrique
        $rubrique = Rubrique::create($request->all());
        return response()->json($rubrique, 201);
    }

    public function show($id)
    {
        // Récupère une rubrique spécifique avec ses relations
        $rubrique = Rubrique::with('declaration', 'sous_rubriques')->findOrFail($id);
        return response()->json($rubrique);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'titre' => 'string|max:255',
            'description' => 'string|max:500',
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
}