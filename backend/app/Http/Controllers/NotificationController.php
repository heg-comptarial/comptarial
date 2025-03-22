<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    /**
     * Récupérer toutes les notifications.
     */
    public function index()
    {
        $notifications = Notification::all();
        return response()->json($notifications);
    }
}
