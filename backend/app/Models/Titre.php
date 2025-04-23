<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Titre extends Model
{
    use HasFactory;

    // Nom de la table associée
    protected $table = 'titre';

    // Désactiver les timestamps automatiques
    public $timestamps = false;

    // Cast des colonnes
    protected $casts = [
        'prive_id' => 'int',
        'compteBancairePostale' => 'boolean',
        'actionOuPartSociale' => 'boolean',
        'autreElementFortune' => 'boolean',
        'aucunElementFortune' => 'boolean',
        'objetsValeur' => 'boolean',
        'fo_gainJeux' => 'boolean',
        'fo_releveFiscal' => 'boolean',
    ];

    // Attributs pouvant être remplis en masse
    protected $fillable = [
        'prive_id',
        'compteBancairePostale',
        'actionOuPartSociale',
        'autreElementFortune',
        'aucunElementFortune',
        'objetsValeur',
        'fo_gainJeux',
        'fo_releveFiscal',
    ];

    // Relation avec le modèle Prive
    public function prive()
    {
        return $this->belongsTo(Prive::class, 'prive_id');
    }
}