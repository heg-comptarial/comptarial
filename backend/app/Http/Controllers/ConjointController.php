<?php

namespace App\Http\Controllers;

use App\Models\Conjoint;
use Illuminate\Http\Request;

class ConjointController extends Controller
{
    public function index()
    {
        // Récupère tous les conjoints avec leurs relations
        $conjoints = Conjoint::with('prive')->get();
        return response()->json($conjoints);
    }

    public function store(Request $request)
    {
        // Valide les données
        $request->validate([
            'prive_id' => 'required|exists:prive,prive_id',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'nationalite' => 'required|string|max:255',
            'dateNaissance' => 'required|date',
            'localite' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'codePostal' => 'required|string|max:10',
            'situationProfessionnelle' => 'required|string|max:255',
        ]);

        // Crée un nouveau conjoint
        $conjoint = Conjoint::create($request->all());
        return response()->json($conjoint, 201);
    }

    public function show($id)
    {
        // Récupère un conjoint spécifique avec sa relation
        $conjoint = Conjoint::with('prive')->findOrFail($id);
        return response()->json($conjoint);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'nom' => 'string|max:255',
            'prenom' => 'string|max:255',
            'nationalite' => 'string|max:255',
            'dateNaissance' => 'date',
            'localite' => 'string|max:255',
            'adresse' => 'string|max:255',
            'codePostal' => 'string|max:10',
            'situationProfessionnelle' => 'string|max:255',
        ]);

        // Met à jour un conjoint
        $conjoint = Conjoint::findOrFail($id);
        $conjoint->update($request->all());
        return response()->json($conjoint);
    }

    public function destroy($id)
    {
        // Supprime un conjoint
        $conjoint = Conjoint::findOrFail($id);
        $conjoint->delete();
        return response()->json(null, 204);
    }
        public function getByPriveId($prive_id)
{
    $conjoint = Conjoint::where('prive_id', $prive_id)->get();

    if ($conjoint->isEmpty()) {
        return response()->noContent();
    }

    return response()->json($conjoint);
}
public function destroyByPriveId($prive_id)
{
    $deleted = Conjoint::where('prive_id', $prive_id)->delete();

    if ($deleted === 0) {
        return response()->noContent();
    }

    return response()->json([
        'message' => 'Toutes les informations associées à ce privé ont été supprimées',
        'count' => $deleted
    ]);
}
}