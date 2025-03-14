<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Declaration
 * 
 * @property int $declaration_id
 * @property int $client_id
 * @property string $titre
 * @property Carbon $date_creation
 * @property string $statut
 * 
 * @property Client $client
 * @property Collection|Formulaire[] $formulaires
 * @property Collection|Rubrique[] $rubriques
 *
 * @package App\Models
 */
class Declaration extends Model
{
	protected $table = 'declaration';
	protected $primaryKey = 'declaration_id';
	public $timestamps = false;

	protected $casts = [
		'client_id' => 'int',
		'date_creation' => 'datetime'
	];

	protected $fillable = [
		'client_id',
		'titre',
		'date_creation',
		'statut'
	];

	public function client()
	{
		return $this->belongsTo(Client::class);
	}

	public function formulaires()
	{
		return $this->hasMany(Formulaire::class);
	}

	public function rubriques()
	{
		return $this->hasMany(Rubrique::class);
	}
}
