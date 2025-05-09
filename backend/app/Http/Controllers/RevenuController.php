<?php

namespace App\Http\Controllers;

use App\Models\Revenu;
use Illuminate\Http\Request;

class RevenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $revenus = Revenu::all();
        return response()->json($revenus);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'prive_id' => 'required|integer',
            'indemnites' => 'required|boolean',
            'interruptionsTravailNonPayees' => 'required|boolean',
            'interuptionsTravailNonPayeesDebut' => 'nullable|date',
            'interuptionsTravailNonPayeesFin' => 'nullable|date',
            'activiteIndependante' => 'required|boolean',
            'prestationsSociales' => 'required|boolean',
            'subsidesAssuranceMaladie' => 'required|boolean',
            'fo_certificatSalaire' => 'required|boolean',
            'fo_renteViagere' => 'required|boolean',
            'fo_allocationLogement' => 'required|boolean',
            'fo_preuveEncaissementSousLoc' => 'required|boolean',
            'fo_gainsAccessoires' => 'required|boolean',
            'fo_attestationAutresRevenus' => 'required|boolean',
            'fo_etatFinancier' => 'required|boolean',
        ]);

        $revenu = Revenu::create($validatedData);
        return response()->json($revenu, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $revenu = Revenu::find($id);

        if (!$revenu) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        return response()->json($revenu);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $revenu = Revenu::find($id);

        if (!$revenu) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $validatedData = $request->validate([
            'prive_id' => 'sometimes|integer',
            'indemnites' => 'sometimes|boolean',
            'interruptionsTravailNonPayees' => 'sometimes|boolean',
            'interuptionsTravailNonPayeesDebut' => 'nullable|date',
            'interuptionsTravailNonPayeesFin' => 'nullable|date',
            'activiteIndependante' => 'sometimes|boolean',
            'prestationsSociales' => 'sometimes|boolean',
            'subsidesAssuranceMaladie' => 'sometimes|boolean',
            'fo_certificatSalaire' => 'sometimes|boolean',
            'fo_renteViagere' => 'sometimes|boolean',
            'fo_allocationLogement' => 'sometimes|boolean',
            'fo_preuveEncaissementSousLoc' => 'sometimes|boolean',
            'fo_gainsAccessoires' => 'sometimes|boolean',
            'fo_attestationAutresRevenus' => 'sometimes|boolean',
            'fo_etatFinancier' => 'sometimes|boolean',
        ]);

        $revenu->update($validatedData);
        return response()->json($revenu);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $revenu = Revenu::find($id);

        if (!$revenu) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $revenu->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
