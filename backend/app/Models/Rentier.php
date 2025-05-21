<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rentier extends Model
{
    use HasFactory;

    // Nom de la table associée
    protected $table = 'rentier';

    protected $primaryKey = 'rentier_id';

    // Désactiver les timestamps automatiques
    public $timestamps = false;

    // Cast des colonnes
    protected $casts = [
        'prive_id' => 'int',
        'fo_attestationRenteAVSAI' => 'boolean',
        'fo_attestationRentePrevoyance' => 'boolean',
        'fo_autresRentes' => 'boolean',
    ];

    // Attributs pouvant être remplis en masse
    protected $fillable = [
        'prive_id',
        'fo_attestationRenteAVSAI',
        'fo_attestationRentePrevoyance',
        'fo_autresRentes',
    ];

    // Relation avec le modèle Prive
    public function prive()
    {
        return $this->belongsTo(Prive::class, 'prive_id');
    }
}