<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use App\Mail\ContactFormMail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
            'recaptcha' => 'required|string',
        ]);

        // Verify reCAPTCHA v3
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => env('RECAPTCHA_SECRET_KEY'),
            'response' => $data['recaptcha'],
        ]);

        $result = $response->json();

        if (!($result['success'] ?? false) || ($result['score'] ?? 0) < 0.5 || ($result['action'] ?? '') !== 'contact') {
            return response()->json(['message' => 'Échec de la vérification reCAPTCHA.'], 422);
        }

        Mail::to(env('CONTACT_FORM_RECEIVER'))->send(new ContactFormMail($data));

        return response()->json(['message' => 'Message envoyé avec succès.']);
    }
}
