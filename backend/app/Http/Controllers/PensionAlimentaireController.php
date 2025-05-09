<?php

namespace App\Http\Controllers;

use App\Models\PensionAlimentaire;
use Illuminate\Http\Request;

class PensionAlimentaireController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pensions = PensionAlimentaire::all();
        return response()->json($pensions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'enfant_id' => 'required|integer',
            'statut' => 'required|string|max:255',
            'montantContribution' => 'required|numeric',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'noContribuable' => 'required|string|max:255',
        ]);

        $pension = PensionAlimentaire::create($validatedData);
        return response()->json($pension, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $pension = PensionAlimentaire::find($id);

        if (!$pension) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        return response()->json($pension);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $pension = PensionAlimentaire::find($id);

        if (!$pension) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $validatedData = $request->validate([
            'enfant_id' => 'sometimes|integer',
            'statut' => 'sometimes|string|max:255',
            'montantContribution' => 'sometimes|numeric',
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'noContribuable' => 'sometimes|string|max:255',
        ]);

        $pension->update($validatedData);
        return response()->json($pension);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pension = PensionAlimentaire::find($id);

        if (!$pension) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $pension->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
