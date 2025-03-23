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
}