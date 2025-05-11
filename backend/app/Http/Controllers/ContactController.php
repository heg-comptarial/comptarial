<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
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
        ]);

        Mail::to(env('CONTACT_FORM_RECEIVER'))->send(new ContactFormMail($data));

        return response()->json(['message' => 'Message envoyé avec succès.']);
    }
}
