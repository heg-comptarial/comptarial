<?php

namespace App\Http\Controllers;

use App\Models\Immobilier;
use Illuminate\Http\Request;

class ImmobilierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $immobiliers = Immobilier::all();
        return response()->json($immobiliers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'prive_id' => 'required|integer',
            'statut' => 'required|string|max:255',
            'canton' => 'required|string|max:255',
            'commune' => 'required|string|max:255',
            'pays' => 'required|string|max:255',
            'noParcelleGeneve' => 'nullable|string|max:255',
            'adresseComplete' => 'required|string|max:255',
            'anneeConstruction' => 'required|integer',
            'occupeDesLe' => 'nullable|date',
            'dateAchat' => 'nullable|date',
            'pourcentageProprietaire' => 'required|numeric',
            'autreProprietaire' => 'nullable|string|max:255',
            'prixAchat' => 'required|numeric',
            'valeurLocativeBrut' => 'required|numeric',
            'loyersEncaisses' => 'nullable|numeric',
            'fraisEntretienDeductibles' => 'nullable|numeric',
            'fo_bienImmobilier' => 'required|boolean',
            'fo_attestationValeurLocative' => 'required|boolean',
            'fo_taxeFonciereBiensEtranger' => 'required|boolean',
            'fo_factureEntretienImmeuble' => 'required|boolean',
        ]);

        $immobilier = Immobilier::create($validatedData);
        return response()->json($immobilier, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $immobilier = Immobilier::find($id);

        if (!$immobilier) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        return response()->json($immobilier);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $immobilier = Immobilier::find($id);

        if (!$immobilier) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $validatedData = $request->validate([
            'prive_id' => 'sometimes|integer',
            'statut' => 'sometimes|string|max:255',
            'canton' => 'sometimes|string|max:255',
            'commune' => 'sometimes|string|max:255',
            'pays' => 'sometimes|string|max:255',
            'noParcelleGeneve' => 'nullable|string|max:255',
            'adresseComplete' => 'sometimes|string|max:255',
            'anneeConstruction' => 'sometimes|integer',
            'occupeDesLe' => 'nullable|date',
            'dateAchat' => 'nullable|date',
            'pourcentageProprietaire' => 'sometimes|numeric',
            'autreProprietaire' => 'nullable|string|max:255',
            'prixAchat' => 'sometimes|numeric',
            'valeurLocativeBrut' => 'sometimes|numeric',
            'loyersEncaisses' => 'nullable|numeric',
            'fraisEntretienDeductibles' => 'nullable|numeric',
            'fo_bienImmobilier' => 'sometimes|boolean',
            'fo_attestationValeurLocative' => 'sometimes|boolean',
            'fo_taxeFonciereBiensEtranger' => 'sometimes|boolean',
            'fo_factureEntretienImmeuble' => 'sometimes|boolean',
        ]);

        $immobilier->update($validatedData);
        return response()->json($immobilier);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $immobilier = Immobilier::find($id);

        if (!$immobilier) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $immobilier->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
    public function getByPriveId($prive_id)
{
    $biens = Immobilier::where('prive_id', $prive_id)->get();

    if ($biens->isEmpty()) {
        return response()->json(['message' => 'Aucun bien immobilier trouvé pour ce privé'], 404);
    }

    return response()->json($biens);
}
public function destroyByPriveId($prive_id)
{
    $deleted = Immobilier::where('prive_id', $prive_id)->delete();

    if ($deleted === 0) {
        return response()->noContent();
    }

    return response()->json([
        'message' => 'Toutes les informations associées à ce privé ont été supprimées',
        'count' => $deleted
    ]);
}

}
