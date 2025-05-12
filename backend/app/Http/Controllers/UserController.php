<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Prive;
use App\Models\Entreprise;
use Illuminate\Http\Request;
use App\Models\Declaration;
use App\Models\Administrateur;
use App\Mail\RegistrationApprovedMail;
use App\Mail\RegistrationRejectedMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;

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
            'statut' => 'required|in:approved,rejected,pending,archive',
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
            'statut' => 'in:approved,rejected,pending,archived',
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
        ->with(['rubriques.documents.commentaires'])
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
                    'dateNaissance' => null, // Par défaut
                    'nationalite' => null,
                    'etatCivil' => null,
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

    public function getDeclarationByYear($userId, $year)
    {
        // Récupère la déclaration d'un utilisateur spécifique pour une année donnée
        $declaration = Declaration::where('user_id', $userId)
            ->where('annee', $year)
            ->with(['rubriques.documents']) // Inclut les rubriques et documents associés
            ->first();

        if (!$declaration) {
            return response()->json(['message' => 'Déclaration non trouvée pour cette année.'], 404);
        }

        return response()->json($declaration);
    }

    public function getUserDetails($id)
    {
        try {
            // Récupérer l'utilisateur avec ses relations (entreprises, prives, déclarations, etc.)
            $user = User::with(['entreprises', 'prives', 'declarations.rubriques.sousRubriques.documents'])
                ->findOrFail($id);

            // Retourner les détails de l'utilisateur
            return response()->json([
                'success' => true,
                'data' => $user,
            ], 200);
        } catch (\Exception $e) {
            // Gérer les erreurs (par exemple, utilisateur non trouvé)
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Récupère les données complètes d'un utilisateur avec ses déclarations et documents associés.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */

    public function getFullUserData($id)
    {
        try {
            $user = User::with([
                'declarations.rubriques.documents'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $user
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé ou erreur de chargement.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Récupère l'ID de l'administrateur connecté.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAdminId()
    {
        try {
            // Vérifie si un utilisateur est authentifié
            $user = Auth::user();

            // Vérifie si l'utilisateur est un administrateur
            if (!$user || $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié ou non administrateur.',
                ], 403);
            }

                    // Trouve l'administrateur correspondant
                $admin = Administrateur::where('user_id', $user->user_id)->first();
                if (!$admin) {
                    return response()->json([
                        'test'=> $user,
                        'success' => false,
                        'message' => 'Administrateur non trouvé.',
                    ], 404);
                }
        
                return response()->json([
                    'success' => true,
                    'admin_id' => $admin->admin_id,
                ], 200);
        
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de l\'ID administrateur.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAllDeclarationTitlesByUser($userId)
    {
        try {
            // Récupère tous les titres des déclarations d'un utilisateur
            $titles = Declaration::where('user_id', $userId)
                ->pluck('titre'); // Récupère uniquement les titres

            // Vérifie si des titres ont été trouvés
            if ($titles->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucun titre de déclaration trouvé pour cet utilisateur.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'titles' => $titles,
            ], 200);
        } catch (\Exception $e) {
            // Gère les erreurs
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des titres des déclarations.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getUserDeclarationsWithDetailsByTitreDeclaration($userId, $titre)
    {
        try {
            // Récupère les déclarations d'un utilisateur avec le titre spécifié
            $declarations = Declaration::where('user_id', $userId)
                ->where('titre', $titre)
                ->with(['rubriques.sousRubriques.documents.commentaires']) // Inclut les relations nécessaires
                ->get();

            // Vérifie si des déclarations ont été trouvées
            if ($declarations->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucune déclaration trouvée avec ce titre pour cet utilisateur.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $declarations,
            ], 200);
        } catch (\Exception $e) {
            // Gère les erreurs
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des déclarations.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retourne les utilisateurs avec au moins une déclaration "pending"
     */
    public function usersWithPendingDeclarations()
    {
        $users = User::where('statut', 'approved') // filtre sur le statut utilisateur
            ->whereHas('declarations', function ($query) {
                $query->where('statut', 'pending');
            })
            ->with(['declarations' => function ($query) {
                $query->where('statut', 'pending');
            }])
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $users
        ]);
    }

    /**
     * Approuve l'inscription d'un utilisateur et envoie un email de confirmation.
     */
    public function approveRegistration($id)
    {
        $user = User::findOrFail($id);
        $user->statut = 'approved';
        $user->save();

        Mail::to($user->email)->send(new RegistrationApprovedMail($user));

        return response()->json(['message' => 'Utilisateur approuvé et email envoyé.']);
    }

    /**
     * Rejette l'inscription d'un utilisateur et envoie un email de notification.
     */
    public function rejectRegistration($id)
    {
        $user = User::findOrFail($id);
        $user->statut = 'rejected';
        $user->save();

        Mail::to($user->email)->send(new RegistrationRejectedMail($user));

        return response()->json(['message' => 'Utilisateur refusé et email envoyé.']);
    }

}
