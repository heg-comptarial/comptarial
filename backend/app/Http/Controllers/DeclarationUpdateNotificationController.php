<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Declaration;
use Illuminate\Support\Facades\Mail;
use App\Mail\DeclarationUpdatedMail;

class DeclarationUpdateNotificationController extends Controller
{
    public function notify($userId, $declarationId)
    {
        $user = User::findOrFail($userId);
        $declaration = Declaration::findOrFail($declarationId);

        Mail::to(env('CONTACT_FORM_RECEIVER'))->send(new DeclarationUpdatedMail($user, $declaration));

        return response()->json(['message' => 'Notification envoyée avec succès.']);
    }
}
