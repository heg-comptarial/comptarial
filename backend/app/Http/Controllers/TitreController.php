<?php

namespace App\Http\Controllers;

use App\Models\Titre;
use Illuminate\Http\Request;

class TitreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $titres = Titre::all();
        return response()->json($titres);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'prive_id' => 'required|integer',
            'compteBancairePostale' => 'required|boolean',
            'actionOuPartSociale' => 'required|boolean',
            'autreElementFortune' => 'required|boolean',
            'aucunElementFortune' => 'required|boolean',
            'objetsValeur' => 'required|boolean',
            'fo_gainJeux' => 'required|boolean',
            'fo_releveFiscal' => 'required|boolean',
        ]);

        $titre = Titre::create($validatedData);
        return response()->json($titre, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $titre = Titre::find($id);

        if (!$titre) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        return response()->json($titre);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $titre = Titre::find($id);

        if (!$titre) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $validatedData = $request->validate([
            'prive_id' => 'sometimes|integer',
            'compteBancairePostale' => 'sometimes|boolean',
            'actionOuPartSociale' => 'sometimes|boolean',
            'autreElementFortune' => 'sometimes|boolean',
            'aucunElementFortune' => 'sometimes|boolean',
            'objetsValeur' => 'sometimes|boolean',
            'fo_gainJeux' => 'sometimes|boolean',
            'fo_releveFiscal' => 'sometimes|boolean',
        ]);

        $titre->update($validatedData);
        return response()->json($titre);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $titre = Titre::find($id);

        if (!$titre) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $titre->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
    public function getByPriveId($prive_id)
{
    $titres = Titre::where('prive_id', $prive_id)->get();

    if ($titres->isEmpty()) {
        return response()->json(['message' => 'Aucun titre trouvé pour ce privé'], 404);
    }

    return response()->json($titres);
}
public function destroyByPriveId($prive_id)
{
    $deleted = Titre::where('prive_id', $prive_id)->delete();

    if ($deleted === 0) {
        return response()->noContent();
    }

    return response()->json([
        'message' => 'Toutes les informations associées à ce privé ont été supprimées',
        'count' => $deleted
    ]);
}
}
