<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        // Récupère tous les utilisateurs
        $users = User::with(['administrateurs', 'declarations', 'entreprises', 'notifications', 'prives'])->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        // Valide les données
        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:user,email',
            'motDePasse' => 'required|string|min:8',
            'localite' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'codePostal' => 'required|string|max:10',
            'numeroTelephone' => 'required|string|max:15',
            'role' => 'required|in:admin,prive,entreprise',
            'statut' => 'required|in:approved,rejected,pending',
        ]);

        // Crée un nouvel utilisateur
        $user = User::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'motDePasse' => bcrypt($request->motDePasse), // Hash du mot de passe
            'localite' => $request->localite,
            'adresse' => $request->adresse,
            'codePostal' => $request->codePostal,
            'numeroTelephone' => $request->numeroTelephone,
            'role' => $request->role,
            'statut' => $request->statut,
        ]);

        return response()->json($user, 201);
    }

    public function show($id)
    {
        // Récupère un utilisateur spécifique avec ses relations
        $user = User::with(['administrateurs', 'declarations', 'entreprises', 'notifications', 'prives'])->findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'nom' => 'string|max:255',
            'email' => 'email|unique:user,email,' . $id . ',user_id',
            'motDePasse' => 'string|min:8',
            'localite' => 'string|max:255',
            'adresse' => 'string|max:255',
            'codePostal' => 'string|max:10',
            'numeroTelephone' => 'string|max:15',
            'role' => 'in:admin,prive,entreprise',
            'statut' => 'in:approved,rejected,pending',
        ]);

        // Met à jour un utilisateur
        $user = User::findOrFail($id);
        $data = $request->all();

        if ($request->has('motDePasse')) {
            $data['motDePasse'] = bcrypt($request->motDePasse); // Hash du mot de passe
        }

        $user->update($data);
        return response()->json($user);
    }

    public function destroy($id)
    {
        // Supprime un utilisateur
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(null, 204);
    }

    public function getPending()
    {
        // Récupère uniquement les utilisateurs en attente
        $pendingUsers = User::where('statut', 'pending')
            ->with(['administrateurs', 'declarations', 'entreprises', 'notifications', 'prives'])
            ->get();
        
        return response()->json($pendingUsers);
    }

}