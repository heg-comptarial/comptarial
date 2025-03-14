<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Client
 * 
 * @property int $client_id
 * @property int $utilisateur_id
 * @property string $type_entreprise
 * @property string $adresse
 * @property string $numero_fiscal
 * 
 * @property Utilisateur $utilisateur
 * @property Collection|Declaration[] $declarations
 * @property Collection|Entreprise[] $entreprises
 * @property Collection|Prive[] $prives
 * @property Collection|Statutclient[] $statutclients
 *
 * @package App\Models
 */
class Client extends Model
{
	protected $table = 'client';
	protected $primaryKey = 'client_id';
	public $timestamps = false;

	protected $casts = [
		'utilisateur_id' => 'int'
	];

	protected $fillable = [
		'utilisateur_id',
		'type_entreprise',
		'adresse',
		'numero_fiscal'
	];

	public function utilisateur()
	{
		return $this->belongsTo(Utilisateur::class);
	}

	public function declarations()
	{
		return $this->hasMany(Declaration::class);
	}

	public function entreprises()
	{
		return $this->hasMany(Entreprise::class);
	}

	public function prives()
	{
		return $this->hasMany(Prive::class);
	}

	public function statutclients()
	{
		return $this->hasMany(Statutclient::class);
	}
}
