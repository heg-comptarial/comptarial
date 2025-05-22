<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AutrePersonneACharge extends Model
{
    use HasFactory;
    public $timestamps = false; // Désactive les timestamps

    // Nom de la table associée
    protected $table = 'autrepersonneacharge';
    protected $primaryKey = 'autre_personne_id';


    // Attributs pouvant être remplis en masse
    protected $fillable = [
        'prive_id',
        'nom',
        'prenom',
        'dateNaissance',
        'degreParente',
        'nbPersonneParticipation',
        'vieAvecPersonneCharge',
        'revenusBrutPersonneACharge',
        'fortuneNetPersonneACharge',
        'montantVerseAPersonneACharge',
        'fo_preuveVersementEffectue',
    ];

    // Relation avec le modèle Prive (si applicable)
    public function prive()
    {
        return $this->belongsTo(Prive::class);
    }
}