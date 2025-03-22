<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prive;

class PriveController extends Controller
{
    /**
     * Récupérer tous les privés.
     */
    public function index()
    {
        $prives = Prive::all();
        return response()->json($prives);
    }
}
