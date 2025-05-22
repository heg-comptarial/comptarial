<?php

namespace App\Http\Controllers;

use App\Models\Deduction;
use Illuminate\Http\Request;

class DeductionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $deductions = Deduction::all();
        return response()->json($deductions);
    }
    public function getByPriveId($prive_id)
{
    $deductions = Deduction::where('prive_id', $prive_id)->firstOrFail();
        return response()->json(data: $deductions);


    if ($deductions->isEmpty()) {
        return response()->json(['message' => 'Aucune déduction trouvée pour ce privé'], 404);
    }

}


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'prive_id' => 'required|integer',
            'fo_rachatLPP' => 'required|boolean',
            'fo_attestation3emePilierA' => 'required|boolean',
            'fo_attestation3emePilierB' => 'required|boolean',
            'fo_attestationAssuranceMaladie' => 'required|boolean',
            'fo_attestationAssuranceAccident' => 'required|boolean',
            'fo_cotisationAVS' => 'required|boolean',
            'fo_fraisFormationProfessionnel' => 'required|boolean',
            'fo_fraisMedicaux' => 'required|boolean',
            'fo_fraisHandicap' => 'required|boolean',
            'fo_dons' => 'required|boolean',
            'fo_versementPartisPolitiques' => 'required|boolean',
        ]);

        $deduction = Deduction::create($validatedData);
        return response()->json($deduction, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $deduction = Deduction::find($id);

        if (!$deduction) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        return response()->json($deduction);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $deduction = Deduction::find($id);

        if (!$deduction) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $validatedData = $request->validate([
            'prive_id' => 'sometimes|integer',
            'fo_rachatLPP' => 'sometimes|boolean',
            'fo_attestation3emePilierA' => 'sometimes|boolean',
            'fo_attestation3emePilierB' => 'sometimes|boolean',
            'fo_attestationAssuranceMaladie' => 'sometimes|boolean',
            'fo_attestationAssuranceAccident' => 'sometimes|boolean',
            'fo_cotisationAVS' => 'sometimes|boolean',
            'fo_fraisFormationProfessionnel' => 'sometimes|boolean',
            'fo_fraisMedicaux' => 'sometimes|boolean',
            'fo_fraisHandicap' => 'sometimes|boolean',
            'fo_dons' => 'sometimes|boolean',
            'fo_versementPartisPolitiques' => 'sometimes|boolean',
        ]);

        $deduction->update($validatedData);
        return response()->json($deduction);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $deduction = Deduction::find($id);

        if (!$deduction) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $deduction->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
    public function destroyByPriveId($prive_id)
{
    $deleted = Deduction::where('prive_id', $prive_id)->delete();

    if ($deleted === 0) {
        return response()->noContent();
    }

    return response()->json([
        'message' => 'Toutes les informations associées à ce privé ont été supprimées',
        'count' => $deleted
    ]);
}

}
