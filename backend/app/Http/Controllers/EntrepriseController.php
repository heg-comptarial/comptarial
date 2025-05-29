<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;

class EntrepriseController extends Controller
{
    public function index()
    {
        // Récupère toutes les entreprises avec leurs relations
        $entreprises = Entreprise::with('user')->get();
        return response()->json($entreprises);
    }

    public function store(Request $request)
    {
        // Valide les données
        $request->validate([
            'user_id' => 'required|exists:user,user_id',
            'raisonSociale' => 'required|string|max:255',
            'prestations' => 'required|string|max:255',
            'grandLivre' => 'required|string|max:255',
            'numeroFiscal' => 'required|string|max:50',
            'nouvelleEntreprise' => 'boolean',
        ]);

        // Crée une nouvelle entreprise
        $entreprise = Entreprise::create($request->all());
        return response()->json($entreprise, 201);
    }

    public function show($id)
    {
        // Récupère une entreprise spécifique avec sa relation
        $entreprise = Entreprise::with('user')->findOrFail($id);
        return response()->json($entreprise);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'raisonSociale' => 'string|max:255',
            'prestations' => 'string|max:255',
            'grandLivre' => 'string|max:255',
            'numeroFiscal' => 'string|max:50',
            'nouvelleEntreprise' => 'boolean',
        ]);

        // Met à jour une entreprise
        $entreprise = Entreprise::findOrFail($id);
        $entreprise->update($request->all());
        return response()->json($entreprise);
    }

    public function destroy($id)
    {
        // Supprime une entreprise
        $entreprise = Entreprise::findOrFail($id);
        $entreprise->delete();
        return response()->json(null, 204);
    }

    public function getEntrepriseByUserId($userId)
{
    // Récupère l'entreprise liée à un user_id donné (avec la relation user)
    $entreprise = Entreprise::with('user')->where('user_id', $userId)->first();

    if (!$entreprise) {
        return response()->json(['message' => 'Entreprise non trouvée'], 404);
    }

    return response()->json($entreprise);
}
}

