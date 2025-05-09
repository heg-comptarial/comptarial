<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Class Conjoint
 * 
 * @property int $conjoint_id
 * @property int $prive_id
 * @property string $nom
 * @property string $prenom
 * @property string $nationalite
 * @property Carbon $dateNaissance
 * @property string $localite
 * @property string $adresse
 * @property string $codePostal
 * @property string $situationProfessionnelle
 * 
 * @property Prive $prive
 *
 * @package App\Models
 */
class Conjoint extends Model
{
	use HasFactory;

    // Nom de la table associée
    protected $table = 'conjoint';

    // Clé primaire
    protected $primaryKey = 'conjoint_id';

    // Désactiver les timestamps automatiques
    public $timestamps = false;

    // Cast des colonnes
    protected $casts = [
        'prive_id' => 'int',
        'dateNaissance' => 'datetime',
    ];

    // Attributs pouvant être remplis en masse
    protected $fillable = [
        'prive_id',
        'nom',
        'prenom',
        'email',
        'localite',
        'adresse',
        'codePostal',
        'numeroTelephone',
        'etatCivil',
        'dateNaissance',
        'nationalite',
        'professionExercee',
        'contributionReligieuse',
    ];

    // Relation avec le modèle Prive
    public function prive()
    {
        return $this->belongsTo(Prive::class, 'prive_id');
    }
}
