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
            'nb_compte' => 'required|integer',
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
            'nb_compte' => 'sometimes|integer',
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
    public function getByPriveId($prive_id)
{
    $banques = Banque::where('prive_id', $prive_id)->firstOrFail();
    return response()->json($banques);
    

}
public function destroyByPriveId($prive_id)
{
    $deleted = Banque::where('prive_id', $prive_id)->delete();

    if ($deleted === 0) {
        return response()->noContent();
    }

    return response()->json([
        'message' => 'Toutes les informations associées à ce privé ont été supprimées',
        'count' => $deleted
    ]);
}
}
