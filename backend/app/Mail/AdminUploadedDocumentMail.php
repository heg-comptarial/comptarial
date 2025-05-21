<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Declaration;

class AdminUploadedDocumentMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $declaration;

    public function __construct(User $user, Declaration $declaration)
    {
        $this->user = $user;
        $this->declaration = $declaration;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouveau document ajouté à votre déclaration'
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin_uploaded_document'
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
