<?php

namespace App\Http\Controllers;

use App\Models\IndemniteAssurance;
use Illuminate\Http\Request;

class IndemniteAssuranceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $indemnites = IndemniteAssurance::all();
        return response()->json($indemnites);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'prive_id' => 'required|integer',
            'fo_chomage' => 'required|boolean',
            'fo_maladie' => 'required|boolean',
            'fo_accident' => 'required|boolean',
            'fo_materniteMilitairePC' => 'required|boolean',
        ]);

        $indemnite = IndemniteAssurance::create($validatedData);
        return response()->json($indemnite, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $indemnite = IndemniteAssurance::find($id);

        if (!$indemnite) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        return response()->json($indemnite);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $indemnite = IndemniteAssurance::find($id);

        if (!$indemnite) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $validatedData = $request->validate([
            'prive_id' => 'sometimes|integer',
            'fo_chomage' => 'sometimes|boolean',
            'fo_maladie' => 'sometimes|boolean',
            'fo_accident' => 'sometimes|boolean',
            'fo_materniteMilitairePC' => 'sometimes|boolean',
        ]);

        $indemnite->update($validatedData);
        return response()->json($indemnite);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $indemnite = IndemniteAssurance::find($id);

        if (!$indemnite) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $indemnite->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
    public function getByPriveId($prive_id)
{
    $indemnites = IndemniteAssurance::where('prive_id', $prive_id)->get();

    if ($indemnites->isEmpty()) {
        return response()->json(['message' => 'Aucune indemnité trouvée pour ce privé'], 404);
    }

    return response()->json($indemnites);
}
public function destroyByPriveId($prive_id)
{
    $deleted = IndemniteAssurance::where('prive_id', $prive_id)->delete();

    if ($deleted === 0) {
        return response()->noContent();
    }

    return response()->json([
        'message' => 'Toutes les informations associées à ce privé ont été supprimées',
        'count' => $deleted
    ]);
}

}
