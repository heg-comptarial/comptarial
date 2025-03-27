<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function test(){
        return response()->json(['message' => 'Test réussi!']);
    }

    // Gérer la connexion
    public function login(Request $request)
    {
        // Validation des données
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Recherche de l'utilisateur
        $user = User::where('email', $request->email)->first();

        // Vérification des identifiants
        if ($user && Hash::check($request->password, $user->motDePasse)) {
            // Générer un token avec Sanctum et renvoyer une réponse JSON
            $token = $user->createToken('MyApp')->plainTextToken;
            return response()->json([
                'message' => 'Identifiants corrects',
                'token' => $token
            ]);
        }

        // Retourner une erreur si les identifiants sont incorrects
        return response()->json(['message' => 'Identifiants incorrects'], 401);
    }

    // Gérer la déconnexion
    public function logout(Request $request)
    {
        $user = Auth::user();
    
        // Vérifie si l'utilisateur est authentifié
        if (!$user) {
            return response()->json([
                'message' => 'User is not authenticated',
            ], 401);
        }
    
        // Révoque le token actuel de l'utilisateur
        $user->currentAccessToken()->delete();
    
        return response()->json([
            'message' => 'Successfully logged out',
        ]);
    }
    

}
