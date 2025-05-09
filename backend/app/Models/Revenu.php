<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Revenu extends Model
{
    use HasFactory;

    // Nom de la table associée
    protected $table = 'revenu';

    // Désactiver les timestamps automatiques
    public $timestamps = false;

    // Cast des colonnes
    protected $casts = [
        'prive_id' => 'int',
        'indemnites' => 'boolean',
        'interruptionsTravailNonPayees' => 'boolean',
        'interuptionsTravailNonPayeesDebut' => 'datetime',
        'interuptionsTravailNonPayeesFin' => 'datetime',
        'activiteIndependante' => 'boolean',
        'prestationsSociales' => 'boolean',
        'subsidesAssuranceMaladie' => 'boolean',
        'fo_certificatSalaire' => 'boolean',
        'fo_renteViagere' => 'boolean',
        'fo_allocationLogement' => 'boolean',
        'fo_preuveEncaissementSousLoc' => 'boolean',
        'fo_gainsAccessoires' => 'boolean',
        'fo_attestationAutresRevenus' => 'boolean',
        'fo_etatFinancier' => 'boolean',
    ];

    // Attributs pouvant être remplis en masse
    protected $fillable = [
        'prive_id',
        'indemnites',
        'interruptionsTravailNonPayees',
        'interuptionsTravailNonPayeesDebut',
        'interuptionsTravailNonPayeesFin',
        'activiteIndependante',
        'prestationsSociales',
        'subsidesAssuranceMaladie',
        'fo_certificatSalaire',
        'fo_renteViagere',
        'fo_allocationLogement',
        'fo_preuveEncaissementSousLoc',
        'fo_gainsAccessoires',
        'fo_attestationAutresRevenus',
        'fo_etatFinancier',
    ];

    // Relation avec le modèle Prive
    public function prive()
    {
        return $this->belongsTo(Prive::class, 'prive_id');
    }
}