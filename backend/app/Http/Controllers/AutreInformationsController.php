<?php

namespace App\Http\Controllers;

use App\Models\AutreInformations;
use Illuminate\Http\Request;

class AutreInformationsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $autreInformations = AutreInformations::all();
        return response()->json($autreInformations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'prive_id' => 'required|integer',
            'fo_versementBoursesEtudes' => 'required|boolean',
            'fo_pensionsPercuesEnfantMajeurACharge' => 'required|boolean',
            'fo_prestationsAVSSPC' => 'required|boolean',
            'fo_prestationsFamilialesSPC' => 'required|boolean',
            'fo_prestationsVilleCommune' => 'required|boolean',
            'fo_allocationsImpotents' => 'required|boolean',
            'fo_reparationTortMoral' => 'required|boolean',
            'fo_hospiceGeneral' => 'required|boolean',
        ]);

        $autreInformations = AutreInformations::create($validatedData);
        return response()->json($autreInformations, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $autreInformations = AutreInformations::find($id);

        if (!$autreInformations) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        return response()->json($autreInformations);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $autreInformations = AutreInformations::find($id);

        if (!$autreInformations) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $validatedData = $request->validate([
            'prive_id' => 'sometimes|integer',
            'fo_versementBoursesEtudes' => 'sometimes|boolean',
            'fo_pensionsPercuesEnfantMajeurACharge' => 'sometimes|boolean',
            'fo_prestationsAVSSPC' => 'sometimes|boolean',
            'fo_prestationsFamilialesSPC' => 'sometimes|boolean',
            'fo_prestationsVilleCommune' => 'sometimes|boolean',
            'fo_allocationsImpotents' => 'sometimes|boolean',
            'fo_reparationTortMoral' => 'sometimes|boolean',
            'fo_hospiceGeneral' => 'sometimes|boolean',
        ]);

        $autreInformations->update($validatedData);
        return response()->json($autreInformations);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $autreInformations = AutreInformations::find($id);

        if (!$autreInformations) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $autreInformations->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
