<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use App\Models\User;

class AuthController extends Controller
{
    // Gérer la connexion
    public function login(Request $request)
    {
        // Validation des entrées
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);
    
        // Vérification des identifiants
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->motDePasse)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }
    
        // Générer un token d’authentification
        $token = $user->createToken('auth_token')->plainTextToken;

        $encryptedTestValue = Crypt::encrypt($user->user_id);
    
    
        // Retourner la réponse avec les deux cookies
        return response()->json([
            'message' => "Connexion réussie, {$user->user_id}",
            'user' => $user,
            'token' => $token, // Tu peux aussi inclure le token dans la réponse JSON si nécessaire
        ])->cookie('auth_token', $token, 60)
        ->cookie('user_id', $encryptedTestValue, 60) // Expire dans 1 heure  '/', null, false, false, false,"None"
        ->cookie('test', $encryptedTestValue, 60);

}

public function logout(Request $request)
{
 // Supprimer le token d'authentification
 $request->user()->tokens()->delete();

 // Supprimer les cookies en les définissant avec une expiration dans le passé
 return response()->json(['message' => 'Déconnexion réussie'])
 ->cookie(Cookie::forget("auth_token"))
 ->cookie(Cookie::forget("user_id"));
}
    

}
