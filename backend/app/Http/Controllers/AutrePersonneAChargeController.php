<?php

namespace App\Http\Controllers;

use App\Models\AutrePersonneACharge;
use Illuminate\Http\Request;

class AutrePersonneAChargeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $autresPersonnes = AutrePersonneACharge::all();
        return response()->json($autresPersonnes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'prive_id' => 'required|integer',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'dateNaissance' => 'required|date',
            'degreParente' => 'required|string|max:255',
            'nbPersonneParticipation' => 'required|integer',
            'vieAvecPersonneCharge' => 'required|boolean',
            'revenusBrutPersonneACharge' => 'required|numeric',
            'fortuneNetPersonneACharge' => 'required|numeric',
        ]);

        $autrePersonne = AutrePersonneACharge::create($validatedData);
        return response()->json($autrePersonne, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $autrePersonne = AutrePersonneACharge::find($id);

        if (!$autrePersonne) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        return response()->json($autrePersonne);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $autrePersonne = AutrePersonneACharge::find($id);

        if (!$autrePersonne) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $validatedData = $request->validate([
            'prive_id' => 'sometimes|integer',
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'dateNaissance' => 'sometimes|date',
            'degreParente' => 'sometimes|string|max:255',
            'nbPersonneParticipation' => 'sometimes|integer',
            'vieAvecPersonneCharge' => 'sometimes|boolean',
            'revenusBrutPersonneACharge' => 'sometimes|numeric',
            'fortuneNetPersonneACharge' => 'sometimes|numeric',
        ]);

        $autrePersonne->update($validatedData);
        return response()->json($autrePersonne);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $autrePersonne = AutrePersonneACharge::find($id);

        if (!$autrePersonne) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $autrePersonne->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
