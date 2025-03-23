<?php

namespace App\Http\Controllers;

use App\Models\SousRubrique;
use Illuminate\Http\Request;

class SousRubriqueController extends Controller
{
    public function index()
    {
        // Récupère toutes les sous-rubriques avec leurs relations
        $sousRubriques = SousRubrique::with('rubrique')->get();
        return response()->json($sousRubriques);
    }

    public function store(Request $request)
    {
        // Valide les données
        $request->validate([
            'rubrique_id' => 'required|exists:rubrique,rubrique_id',
            'titre' => 'required|string|max:255',
            'description' => 'required|string|max:500',
        ]);

        // Crée une nouvelle sous-rubrique
        $sousRubrique = SousRubrique::create($request->all());
        return response()->json($sousRubrique, 201);
    }

    public function show($id)
    {
        // Récupère une sous-rubrique spécifique avec sa relation
        $sousRubrique = SousRubrique::with('rubrique')->findOrFail($id);
        return response()->json($sousRubrique);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'titre' => 'string|max:255',
            'description' => 'string|max:500',
        ]);

        // Met à jour une sous-rubrique
        $sousRubrique = SousRubrique::findOrFail($id);
        $sousRubrique->update($request->all());
        return response()->json($sousRubrique);
    }

    public function destroy($id)
    {
        // Supprime une sous-rubrique
        $sousRubrique = SousRubrique::findOrFail($id);
        $sousRubrique->delete();
        return response()->json(null, 204);
    }
}