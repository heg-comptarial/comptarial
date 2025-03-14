<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Prive
 * 
 * @property int $prive_id
 * @property int $client_id
 * @property string $nationalite
 * @property Carbon $date_de_naissance
 * @property string $etat_civil
 * 
 * @property Client $client
 * @property Collection|Conjoint[] $conjoints
 * @property Collection|Formulaire[] $formulaires
 *
 * @package App\Models
 */
class Prive extends Model
{
	protected $table = 'prive';
	protected $primaryKey = 'prive_id';
	public $timestamps = false;

	protected $casts = [
		'client_id' => 'int',
		'date_de_naissance' => 'datetime'
	];

	protected $fillable = [
		'client_id',
		'nationalite',
		'date_de_naissance',
		'etat_civil'
	];

	public function client()
	{
		return $this->belongsTo(Client::class);
	}

	public function conjoints()
	{
		return $this->hasMany(Conjoint::class);
	}

	public function formulaires()
	{
		return $this->hasMany(Formulaire::class);
	}
}
