<?php

namespace App\Http\Controllers;

use App\Models\Banque;
use Illuminate\Http\Request;

class BanqueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $banques = Banque::all();
        return response()->json($banques);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'prive_id' => 'required|integer',
            'fo_attestationFinAnnee' => 'required|boolean',
        ]);

        $banque = Banque::create($validatedData);
        return response()->json($banque, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $banque = Banque::find($id);

        if (!$banque) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        return response()->json($banque);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $banque = Banque::find($id);

        if (!$banque) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $validatedData = $request->validate([
            'prive_id' => 'sometimes|integer',
            'fo_attestationFinAnnee' => 'sometimes|boolean',
        ]);

        $banque->update($validatedData);
        return response()->json($banque);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $banque = Banque::find($id);

        if (!$banque) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        $banque->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
