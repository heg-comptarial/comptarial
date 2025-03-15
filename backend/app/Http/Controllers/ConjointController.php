<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conjoint;

class ConjointController extends Controller
{
    /**
     * Récupérer tous les conjoints.
     */
    public function index()
    {
        $conjoints = Conjoint::all();
        return response()->json($conjoints);
    }
}
