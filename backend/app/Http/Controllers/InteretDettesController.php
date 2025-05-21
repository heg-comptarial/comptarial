<?php

namespace App\Http\Controllers;

use App\Models\InteretDettes;
use Illuminate\Http\Request;

class InteretDettesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $interetsDettes = InteretDettes::all();
        return response()->json($interetsDettes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'prive_id' => 'required|integer',
            'fo_attestationEmprunt' => 'required|boolean',
            'fo_attestationCarteCredit' => 'required|boolean',
            'fo_attestationHypotheque' => 'required|boolean',
        ]);

        $interetDette = InteretDettes::create($validatedData);
        return response()->json($interetDette, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $interetDette = InteretDettes::find($id);

        if (!$interetDette) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        return response()->json($interetDette);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $interetDette = InteretDettes::find($id);

        if (!$interetDette) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $validatedData = $request->validate([
            'prive_id' => 'sometimes|integer',
            'fo_attestationEmprunt' => 'sometimes|boolean',
            'fo_attestationCarteCredit' => 'sometimes|boolean',
            'fo_attestationHypotheque' => 'sometimes|boolean',
        ]);

        $interetDette->update($validatedData);
        return response()->json($interetDette);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $interetDette = InteretDettes::find($id);

        if (!$interetDette) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $interetDette->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
    public function getByPriveId($prive_id)
{
    $interets = InteretDettes::where('prive_id', $prive_id)->get();

    if ($interets->isEmpty()) {
        return response()->json(['message' => 'Aucun intérêt/dette trouvé pour ce privé'], 404);
    }

    return response()->json($interets);
}
public function destroyByPriveId($prive_id)
{
    $deleted = InteretDettes::where('prive_id', $prive_id)->delete();

    if ($deleted === 0) {
        return response()->noContent();
    }

    return response()->json([
        'message' => 'Toutes les informations associées à ce privé ont été supprimées',
        'count' => $deleted
    ]);
}

}
