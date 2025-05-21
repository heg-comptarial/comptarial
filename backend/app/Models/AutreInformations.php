<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AutreInformations extends Model
{
    use HasFactory;

    // Nom de la table associée
    protected $table = 'autreinformations';
    public $timestamps = false; // Désactive les timestamps

    // Attributs pouvant être remplis en masse
    protected $fillable = [
        'prive_id',
        'fo_versementBoursesEtudes',
        'fo_pensionsPercuesEnfantMajeurACharge',
        'fo_prestationsAVSSPC',
        'fo_prestationsFamilialesSPC',
        'fo_prestationsVilleCommune',
        'fo_allocationsImpotents',
        'fo_reparationTortMoral',
        'fo_hospiceGeneral',
        'fo_institutionBienfaisance',
    ];

    // Relation avec le modèle Prive (si applicable)
    public function prive()
    {
        return $this->belongsTo(Prive::class);
    }
}