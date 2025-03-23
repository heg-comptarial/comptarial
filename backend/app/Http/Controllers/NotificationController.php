<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

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
        $notification = Notification::create($request->all());
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
}