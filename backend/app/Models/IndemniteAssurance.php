<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndemniteAssurance extends Model
{
    use HasFactory;

    // Nom de la table associée
    protected $table = 'indemniteassurance';

    // Désactiver les timestamps automatiques
    public $timestamps = false;

    // Cast des colonnes
    protected $casts = [
        'prive_id' => 'int',
        'fo_chomage' => 'boolean',
        'fo_maladie' => 'boolean',
        'fo_accident' => 'boolean',
        'fo_materniteMilitairePC' => 'boolean',
    ];

    // Attributs pouvant être remplis en masse
    protected $fillable = [
        'prive_id',
        'fo_chomage',
        'fo_maladie',
        'fo_accident',
        'fo_materniteMilitairePC',
    ];

    // Relation avec le modèle Prive
    public function prive()
    {
        return $this->belongsTo(Prive::class, 'prive_id');
    }
}