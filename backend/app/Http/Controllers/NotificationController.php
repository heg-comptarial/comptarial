<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Carbon\Carbon;

class NotificationController extends Controller
{
    public function index()
    {
        // Récupère toutes les notifications avec leurs relations
        $notifications = Notification::with('user')->get();
        return response()->json($notifications);
    }

    public function store(Request $request)
    {
        // Valide les données
        $request->validate([
            'user_id' => 'required|exists:user,user_id',
            'contenu' => 'required|string|max:255',
        ]);

        // Crée une nouvelle notification
        $notification = Notification::create([
            'user_id' => $request->user_id,
            'contenu' => $request->contenu,
            'dateCreation' => Carbon::now(),
            'isRead' => false
        ]);
        
        return response()->json($notification, 201);
    }

    public function show($id)
    {
        // Récupère une notification spécifique avec sa relation
        $notification = Notification::with('user')->findOrFail($id);
        return response()->json($notification);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'contenu' => 'string|max:255',
        ]);

        // Met à jour une notification
        $notification = Notification::findOrFail($id);
        $notification->update($request->all());
        return response()->json($notification);
    }

    public function destroy($id)
    {
        // Supprime une notification
        $notification = Notification::findOrFail($id);
        $notification->delete();
        return response()->json(null, 204);
    }

    public function getUserNotifications($userId)
    {
        // Récupère toutes les notifications d'un utilisateur spécifique
        $notifications = Notification::where('user_id', $userId)
            ->orderBy('dateCreation', 'desc')
            ->get();
            
        return response()->json($notifications);
    }
    
    public function markAllAsRead(Request $request, $userId)
    {
        // Marque toutes les notifications d'un utilisateur comme lues
        Notification::where('user_id', $userId)
            ->where('isRead', false)
            ->update(['isRead' => true]);
            
        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues']);
    }

    public function createDocumentCommentNotification(Request $request)
    {
        $request->validate([
            'admin_id' => 'required|exists:administrateur,admin_id',
            'document_id' => 'required|exists:document,doc_id',
            'contenu' => 'required|string'
        ]);
        
        // Récupérer le document et l'utilisateur associé
        $document = \App\Models\Document::with('rubrique.declaration.user')->findOrFail($request->document_id);
        $admin = \App\Models\Administrateur::with('user')->findOrFail($request->admin_id);
        
        if (!$document->rubrique || !$document->rubrique->declaration || !$document->rubrique->declaration->user) {
            return response()->json(['message' => 'Impossible de trouver l\'utilisateur associé au document'], 404);
        }
        
        $user = $document->rubrique->declaration->user;
        $adminName = $admin->user ? $admin->user->nom : 'Un administrateur';
        
        // Créer la notification
        $notification = Notification::create([
            'user_id' => $user->user_id,
            'contenu' => "{$adminName} a commenté votre document '{$document->nom}'",
            'dateCreation' => Carbon::now(),
            'isRead' => false
        ]);
        
        return response()->json($notification, 201);
    }
    
    public function createDocumentStatusNotification(Request $request)
    {
        $request->validate([
            'document_id' => 'required|exists:document,doc_id',
            'status' => 'required|string|in:approved,rejected,pending'
        ]);
        
        // Récupérer le document et l'utilisateur associé
        $document = \App\Models\Document::with('rubrique.declaration.user')->findOrFail($request->document_id);
        
        if (!$document->rubrique || !$document->rubrique->declaration || !$document->rubrique->declaration->user) {
            return response()->json(['message' => 'Impossible de trouver l\'utilisateur associé au document'], 404);
        }
        
        $user = $document->rubrique->declaration->user;
        
        // Déterminer le message en fonction du statut
        $statusMessage = '';
        switch($request->status) {
            case 'approved':
                $statusMessage = 'a été validé';
                break;
            case 'rejected':
                $statusMessage = 'a été refusé';
                break;
            case 'pending':
                $statusMessage = 'est en attente de validation';
                break;
        }
        
        // Créer la notification
        $notification = Notification::create([
            'user_id' => $user->user_id,
            'contenu' => "Votre document '{$document->nom}' {$statusMessage}",
            'dateCreation' => Carbon::now(),
            'isRead' => false
        ]);
        
        return response()->json($notification, 201);
    }
    
    public function createDeclarationStatusNotification(Request $request)
    {
        $request->validate([
            'declaration_id' => 'required|exists:declaration,declaration_id',
            'status' => 'required|string|in:approved,rejected,pending'
        ]);
        
        // Récupérer la déclaration et l'utilisateur associé
        $declaration = \App\Models\Declaration::with('user')->findOrFail($request->declaration_id);
        
        if (!$declaration->user) {
            return response()->json(['message' => 'Impossible de trouver l\'utilisateur associé à la déclaration'], 404);
        }
        
        // Déterminer le message en fonction du statut
        $statusMessage = '';
        switch($request->status) {
            case 'approved':
                $statusMessage = 'a été validée';
                break;
            case 'rejected':
                $statusMessage = 'a été refusée';
                break;
            case 'pending':
                $statusMessage = 'est en attente de validation';
                break;
        }
        
        // Créer la notification
        $notification = Notification::create([
            'user_id' => $declaration->user->user_id,
            'contenu' => "Votre déclaration '{$declaration->titre}' {$statusMessage}",
            'dateCreation' => Carbon::now(),
            'isRead' => false
        ]);
        
        return response()->json($notification, 201);
    }


    public function createRubriqueStatusNotification(Request $request)
    {
        $request->validate([
            'rubrique_id' => 'required|exists:rubrique,rubrique_id',
            'status' => 'required|string|in:approved,rejected,pending'
        ]);
        
        // Récupérer la rubrique et l'utilisateur associé
        $rubrique = \App\Models\Rubrique::with('declaration.user')->findOrFail($request->rubrique_id);
        
        if (!$rubrique->declaration || !$rubrique->declaration->user) {
            return response()->json(['message' => 'Impossible de trouver l\'utilisateur associé à la rubrique'], 404);
        }
        
        // Déterminer le message en fonction du statut
        $statusMessage = '';
        switch($request->status) {
            case 'approved':
                $statusMessage = 'a été validée';
                break;
            case 'rejected':
                $statusMessage = 'a été refusée';
                break;
            case 'pending':
                $statusMessage = 'est en attente de validation';
                break;
        }
        
        // Créer la notification
        $notification = Notification::create([
            'user_id' => $rubrique->declaration->user->user_id,
            'contenu' => "Votre rubrique '{$rubrique->nom}' {$statusMessage}",
            'dateCreation' => Carbon::now(),
            'isRead' => false
        ]);
        
        return response()->json($notification, 201);
    }

    public function createUserStatusNotification(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:user,user_id',
            'status' => 'required|string|in:approved,rejected,pending'
        ]);
        
        // Récupérer l'utilisateur
        $user = \App\Models\User::findOrFail($request->user_id);
        
        // Déterminer le message en fonction du statut
        $statusMessage = '';
        switch($request->status) {
            case 'approved':
                $statusMessage = 'a été validé';
                break;
            case 'rejected':
                $statusMessage = 'a été refusé';
                break;
            case 'pending':
                $statusMessage = 'est en attente de validation';
                break;
        }
        
        // Créer la notification
        $notification = Notification::create([
            'user_id' => $user->user_id,
            'contenu' => "Votre compte {$statusMessage}",
            'dateCreation' => Carbon::now(),
            'isRead' => false
        ]);
        
        return response()->json($notification, 201);
    }


}