<?php

namespace App\Http\Controllers;

use App\Models\Administrateur;
use Illuminate\Http\Request;

class AdministrateurController extends Controller
{
    public function index()
    {
        // Récupère tous les administrateurs avec leurs relations
        $administrateurs = Administrateur::with('user', 'commentaires')->get();
        return response()->json($administrateurs);
    }

    public function store(Request $request)
    {
        // Valide les données
        $request->validate([
            'user_id' => 'required|exists:user,user_id',
            'niveauAcces' => 'required|in:admin,super_admin',
        ]);

        // Crée un nouvel administrateur
        $administrateur = Administrateur::create($request->all());
        return response()->json($administrateur, 201);
    }

    public function show($id)
    {
        // Récupère un administrateur spécifique avec ses relations
        $administrateur = Administrateur::with('user', 'commentaires')->findOrFail($id);
        return response()->json($administrateur);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'niveauAcces' => 'in:admin,super_admin',
        ]);

        // Met à jour un administrateur
        $administrateur = Administrateur::findOrFail($id);
        $administrateur->update($request->all());
        return response()->json($administrateur);
    }

    public function destroy($id)
    {
        // Supprime un administrateur
        $administrateur = Administrateur::findOrFail($id);
        $administrateur->delete();
        return response()->json(null, 204);
    }
}