<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Enfant
 * 
 * @property int $id
 * @property int $prive_id
 * @property string $nom
 * @property string $prenom
 * @property Carbon $dateNaissance
 * @property string $adresse
 * @property string $codePostal
 * @property string $localite
 * @property string $noAVS
 * @property string $noContribuable
 * @property float $revenuBrut
 * @property float $fortuneNet
 * 
 * @property Prive $prive
 *
 * @package App\Models
 */
class Enfant extends Model
{
	protected $table = 'enfants';
	public $timestamps = false;

	protected $casts = [
		'prive_id' => 'int',
		'dateNaissance' => 'datetime',
		'revenuBrut' => 'float',
		'fortuneNet' => 'float'
	];

	protected $fillable = [
		'prive_id',
		'nom',
		'prenom',
		'dateNaissance',
		'adresse',
		'codePostal',
		'localite',
		'noAVS',
		'noContribuable',
		'revenuBrut',
		'fortuneNet'
	];

	public function prive()
	{
		return $this->belongsTo(Prive::class, 'prive_id');
	}
}
