<?php

namespace App\Http\Controllers;

use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log;

class ForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json(['message' => 'Aucun utilisateur trouvé.'], 404);
        }

        // Generate token
        $token = Password::createToken($user);

        // Build the reset URL
        $url = "http://localhost:3000/reset-password?token={$token}&email=" . urlencode($user->email);

        // Send custom email
        try {
            Mail::to($user->email)->send(new ResetPasswordMail($url, $user));
            return response()->json(['message' => 'Lien de réinitialisation envoyé.']);
        } catch (\Throwable $e) {
            Log::error("Erreur envoi email: " . $e->getMessage());
            return response()->json(['message' => 'Impossible d\'envoyer l\'email.'], 422);
        }
    }
}
