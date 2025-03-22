<?php

namespace App\Http\Controllers;

use App\Models\Enfant;
use Illuminate\Http\Request;

class EnfantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $enfants = Enfant::all();
        return response()->json($enfants);
    }
}
