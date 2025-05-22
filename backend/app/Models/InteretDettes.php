<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InteretDettes extends Model
{
    use HasFactory;

    // Nom de la table associée
    protected $table = 'interetdettes';
    protected $primaryKey = 'dettes_id';


    // Désactiver les timestamps automatiques
    public $timestamps = false;

    // Cast des colonnes
    protected $casts = [
        'prive_id' => 'int',
        'fo_attestationEmprunt' => 'boolean',
        'fo_attestationCarteCredit' => 'boolean',
        'fo_attestationHypotheque' => 'boolean',
    ];

    // Attributs pouvant être remplis en masse
    protected $fillable = [
        'prive_id',
        'fo_attestationEmprunt',
        'fo_attestationCarteCredit',
        'fo_attestationHypotheque',
    ];

    // Relation avec le modèle Prive
    public function prive()
    {
        return $this->belongsTo(Prive::class, 'prive_id');
    }
}