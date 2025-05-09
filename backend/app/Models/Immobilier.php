<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Immobilier extends Model
{
    use HasFactory;

    // Nom de la table associée
    protected $table = 'immobilier';

    // Désactiver les timestamps automatiques
    public $timestamps = false;

    // Cast des colonnes
    protected $casts = [
        'prive_id' => 'int',
        'anneeConstruction' => 'int',
        'pourcentageProprietaire' => 'float',
        'prixAchat' => 'float',
        'valeurLocativeBrut' => 'float',
        'loyersEncaisses' => 'float',
        'fraisEntretienDeductibles' => 'float',
        'fo_bienImmobilier' => 'boolean',
        'fo_attestationValeurLocative' => 'boolean',
        'fo_taxeFonciereBiensEtranger' => 'boolean',
        'fo_factureEntretienImmeuble' => 'boolean',
    ];

    // Attributs pouvant être remplis en masse
    protected $fillable = [
        'prive_id',
        'statut',
        'canton',
        'commune',
        'pays',
        'noParcelleGeneve',
        'adresseComplete',
        'anneeConstruction',
        'occupeDesLe',
        'dateAchat',
        'pourcentageProprietaire',
        'autreProprietaire',
        'prixAchat',
        'valeurLocativeBrut',
        'loyersEncaisses',
        'fraisEntretienDeductibles',
        'fo_bienImmobilier',
        'fo_attestationValeurLocative',
        'fo_taxeFonciereBiensEtranger',
        'fo_factureEntretienImmeuble',
    ];

    // Relation avec le modèle Prive
    public function prive()
    {
        return $this->belongsTo(Prive::class, 'prive_id');
    }
}