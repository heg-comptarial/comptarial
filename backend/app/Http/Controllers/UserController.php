<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Prive;
use App\Models\Entreprise;
use Illuminate\Http\Request;
use App\Models\Declaration;

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

    public function getUserDeclarationWithDetails($userId, $declarationId)
    {
    // Récupère la déclaration spécifique d'un utilisateur avec ses relations
    $declaration = Declaration::where('user_id', $userId)
        ->where('declaration_id', $declarationId)
        ->with(['rubriques.documents'])
        ->firstOrFail();

    return response()->json($declaration);
    }

    public function getAllDeclarationsByUser($userId)
    {
    // Récupère toutes les déclarations d'un utilisateur avec leurs relations
    $declarations = Declaration::where('user_id', $userId)
        ->with(['rubriques.documents'])
        ->get();

    return response()->json($declarations);
}

    public function getPending()
    {
        // Récupère uniquement les utilisateurs en attente
        $pendingUsers = User::where('statut', 'pending')
            ->with(['administrateurs', 'declarations', 'entreprises', 'notifications', 'prives'])
            ->get();
        
        return response()->json($pendingUsers);
    }

    public function getApproved()
    {
        // Récupère uniquement les utilisateurs acceptés qui ne sont pas administrateurs
        $approvedUsers = User::where('statut', 'approved')
            ->whereDoesntHave('administrateurs') // Exclure les administrateurs
            ->where(function ($query) {
                $query->whereHas('entreprises') // Inclure ceux qui ont des entreprises
                    ->orWhereHas('prives');  // Inclure ceux qui ont des privés
            })
            ->with(['declarations', 'entreprises', 'notifications', 'prives'])
            ->get();
        
        return response()->json($approvedUsers);
    }

    public function approveUser(Request $request, $id)
    {
        try {
            // Récupère l'utilisateur en utilisant le user_id
            $user = User::where('user_id', $id)->firstOrFail();
        
            // Création de Prive ou Entreprise en fonction du rôle
            if ($user->role === 'prive') {
                Prive::create([
                    'user_id' => $user->user_id, // Utilisez user_id ici
                    'dateNaissance' => now(), // Par défaut
                    'nationalite' => 'Non spécifiée',
                    'etatCivil' => 'Non spécifié',
                    'fo_banques' => false,
                    'fo_dettes' => false,
                    'fo_immobiliers' => false,
                    'fo_salarie' => false,
                    'fo_autrePersonneCharge' => false,
                    'fo_independant' => false,
                    'fo_rentier' => false,
                    'fo_autreRevenu' => false,
                    'fo_assurance' => false,
                    'fo_autreDeduction' => false,
                    'fo_autreInformations' => false,
                ]);
            } elseif ($user->role === 'entreprise') {
                Entreprise::create([
                    'user_id' => $user->user_id, // Utilisez user_id ici
                    'raisonSociale' => 'Non spécifiée',
                    'prestations' => 'Non spécifiées',
                    'grandLivre' => 'Non spécifié',
                    'numeroFiscal' => 'Non spécifié',
                    'nouvelleEntreprise' => true, // Par défaut
                ]);
            }
        
            return response()->json(['message' => 'Utilisateur approuvé et type créé avec succès.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur : ' . $e->getMessage()], 500);
        }
    }
}