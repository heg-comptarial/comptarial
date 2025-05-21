<?php

namespace App\Http\Controllers;

use App\Models\Enfant;
use Illuminate\Http\Request;

class EnfantController extends Controller
{
    public function index()
    {
        // Récupère tous les enfants avec leurs relations
        $enfants = Enfant::with('prive')->get();
        return response()->json($enfants);
    }

    public function store(Request $request)
    {
        // Valide les données
        $request->validate([
            'prive_id' => 'required|exists:prive,prive_id',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'dateNaissance' => 'required|date',
            'adresse' => 'required|string|max:255',
            'codePostal' => 'required|string|max:10',
            'localite' => 'required|string|max:255',
            'noAVS' => 'required|string|max:20',
            'noContribuable' => 'required|string|max:20',
            'revenuBrut' => 'required|numeric',
            'fortuneNet' => 'required|numeric',
        ]);

        // Crée un nouvel enfant
        $enfant = Enfant::create($request->all());
        return response()->json($enfant, 201);
    }

    public function show($id)
    {
        // Récupère un enfant spécifique avec sa relation
        $enfant = Enfant::with('prive')->findOrFail($id);
        return response()->json($enfant);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'nom' => 'string|max:255',
            'prenom' => 'string|max:255',
            'dateNaissance' => 'date',
            'adresse' => 'string|max:255',
            'codePostal' => 'string|max:10',
            'localite' => 'string|max:255',
            'noAVS' => 'string|max:20',
            'noContribuable' => 'string|max:20',
            'revenuBrut' => 'numeric',
            'fortuneNet' => 'numeric',
        ]);

        // Met à jour un enfant
        $enfant = Enfant::findOrFail($id);
        $enfant->update($request->all());
        return response()->json($enfant);
    }

    public function destroy($id)
    {
        // Supprime un enfant
        $enfant = Enfant::findOrFail($id);
        $enfant->delete();
        return response()->json(null, 204);
    }
    public function destroyByPriveId($prive_id)
{
    $deleted = Enfant::where('prive_id', $prive_id)->delete();

    if ($deleted === 0) {
        return response()->noContent();
    }

    return response()->json([
        'message' => 'Toutes les informations associées à ce privé ont été supprimées',
        'count' => $deleted
    ]);
}
//     public function destroyByEnfantId($id)
// {
//     $deleted = Enfant::where('enfant_id', $id)->delete();

//     if ($deleted === 0) {
//         return response()->noContent();
//     }

//     return response()->json([
//         'message' => 'Toutes les informations associées à ce privé ont été supprimées',
//         'count' => $deleted
//     ]);
// }
}