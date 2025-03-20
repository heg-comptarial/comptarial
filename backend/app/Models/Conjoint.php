<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Conjoint
 * 
 * @property int $conjoint_id
 * @property int $prive_id
 * @property string $nom
 * @property string $prenom
 * @property string $nationalite
 * @property Carbon $date_de_naissance
 * @property string $localite
 * @property string $adresse
 * @property string $code_postal
 * 
 * @property Prive $prive
 *
 * @package App\Models
 */
class Conjoint extends Model
{
	protected $table = 'conjoint';
	protected $primaryKey = 'conjoint_id';
	public $timestamps = false;

	protected $casts = [
		'prive_id' => 'int'
	];

	protected $fillable = [
		'prive_id',
		'nom',
		'prenom',
		'nationalite',
		'dateDeNaissance',
		'localite',
		'adresse',
		'codePostal',
		'SituationProfessionnelle'
	];

	public function prive()
	{
		return $this->belongsTo(Prive::class);
	}
}
