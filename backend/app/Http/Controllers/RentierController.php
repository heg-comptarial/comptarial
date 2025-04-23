<?php

namespace App\Http\Controllers;

use App\Models\Rentier;
use Illuminate\Http\Request;

class RentierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rentiers = Rentier::all();
        return response()->json($rentiers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'prive_id' => 'required|integer',
            'fo_attestationRenteAVSAI' => 'required|boolean',
            'fo_attestationRentePrevoyance' => 'required|boolean',
            'fo_autresRentes' => 'required|boolean',
        ]);

        $rentier = Rentier::create($validatedData);
        return response()->json($rentier, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $rentier = Rentier::find($id);

        if (!$rentier) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        return response()->json($rentier);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $rentier = Rentier::find($id);

        if (!$rentier) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $validatedData = $request->validate([
            'prive_id' => 'sometimes|integer',
            'fo_attestationRenteAVSAI' => 'sometimes|boolean',
            'fo_attestationRentePrevoyance' => 'sometimes|boolean',
            'fo_autresRentes' => 'sometimes|boolean',
        ]);

        $rentier->update($validatedData);
        return response()->json($rentier);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $rentier = Rentier::find($id);

        if (!$rentier) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $rentier->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
