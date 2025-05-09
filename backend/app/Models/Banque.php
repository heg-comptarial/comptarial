<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banque extends Model
{
    use HasFactory;

    // Nom de la table associée
    protected $table = 'banque';

    // Attributs pouvant être remplis en masse
    protected $fillable = [
        'prive_id',
        'fo_attestationFinAnnee',
    ];

    // Relation avec le modèle Prive (si applicable)
    public function prive()
    {
        return $this->belongsTo(Prive::class);
    }
}