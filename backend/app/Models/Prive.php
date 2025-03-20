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
 * @property User $user
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
		'user_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'nationalité',
		'dateDeNaissance',
		'etatCivil',
		'numeroFiscal'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function conjoints()
	{
		return $this->hasOne(Conjoint::class);
	}

	public function formulaires()
	{
		return $this->hasMany(Formulaire::class);
	}
}
