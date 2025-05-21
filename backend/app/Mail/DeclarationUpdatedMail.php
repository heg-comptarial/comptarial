<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Declaration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;

class DeclarationUpdatedMail extends Mailable
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
            subject: 'Déclaration mise à jour'
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.declaration_updated'
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
