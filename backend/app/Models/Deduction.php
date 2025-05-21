<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deduction extends Model
{
    use HasFactory;

    // Nom de la table associée
    protected $table = 'deduction';
    protected $primaryKey = 'autre_deduction_id';

    // Désactiver les timestamps automatiques
    public $timestamps = false;

    // Cast des colonnes
    protected $casts = [
        'prive_id' => 'int',
        'fo_rachatLPP' => 'boolean',
        'fo_attestation3emePilierA' => 'boolean',
        'fo_attestation3emePilierB' => 'boolean',
        'fo_attestationAssuranceMaladie' => 'boolean',
        'fo_attestationAssuranceAccident' => 'boolean',
        'fo_cotisationAVS' => 'boolean',
        'fo_fraisFormationProfessionnel' => 'boolean',
        'fo_fraisMedicaux' => 'boolean',
        'fo_fraisHandicap' => 'boolean',
        'fo_dons' => 'boolean',
        'fo_versementPartisPolitiques' => 'boolean',
    ];

    // Attributs pouvant être remplis en masse
    protected $fillable = [
        'prive_id',
        'fo_rachatLPP',
        'fo_attestation3emePilierA',
        'fo_attestation3emePilierB',
        'fo_attestationAssuranceMaladie',
        'fo_attestationAssuranceAccident',
        'fo_cotisationAVS',
        'fo_fraisFormationProfessionnel',
        'fo_fraisMedicaux',
        'fo_fraisHandicap',
        'fo_dons',
        'fo_versementPartisPolitiques',
    ];

    // Relation avec le modèle Prive
    public function prive()
    {
        return $this->belongsTo(Prive::class, 'prive_id');
    }
}