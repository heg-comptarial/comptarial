<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Class Declaration
 * 
 * @property int $declaration_id
 * @property int $user_id
 * @property string $titre
 * @property string $statut
 * @property string $annee
 * @property Carbon $dateCreation
 * 
 * @property User $user
 * @property Collection|Rubrique[] $rubriques
 *
 * @package App\Models
 */
class Declaration extends Model
{
    use HasFactory;

    // Nom de la table associée
    protected $table = 'declaration';

    // Clé primaire
    protected $primaryKey = 'declaration_id';

    // Désactiver les timestamps automatiques
    public $timestamps = false;

    // Cast des colonnes
    protected $casts = [
        'user_id' => 'int',
        'dateCreation' => 'datetime',
    ];

    // Attributs pouvant être remplis en masse
    protected $fillable = [
        'user_id',
        'titre',
        'statut',
        'annee',
        'dateCreation',
    ];

    // Relation avec le modèle User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relation avec le modèle Rubrique
    public function rubriques()
    {
        return $this->hasMany(Rubrique::class, 'declaration_id');
    }
}
