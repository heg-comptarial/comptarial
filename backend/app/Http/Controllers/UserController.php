<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Récupérer tous les utilisateurs.
     */
    public function index()
    {
        $utilisateurs = User::all();
        return response()->json($utilisateurs);
    }
}
