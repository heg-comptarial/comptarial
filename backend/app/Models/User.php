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
 * Class User
 * 
 * @property int $user_id
 * @property string $nom
 * @property string $email
 * @property string $motDePasse
 * @property string $localite
 * @property string $adresse
 * @property string $codePostal
 * @property string $numeroTelephone
 * @property string $role
 * @property string $statut
 * @property Carbon $dateCreation
 * 
 * @property Collection|Administrateur[] $administrateurs
 * @property Collection|Declaration[] $declarations
 * @property Collection|Entreprise[] $entreprises
 * @property Collection|Notification[] $notifications
 * @property Collection|Prive[] $prives
 *
 * @package App\Models
 */
class User extends Model
{
	use HasFactory;
	protected $table = 'user';
	protected $primaryKey = 'user_id';
	public $timestamps = false;

	protected $casts = [
		'dateCreation' => 'datetime'
	];

	protected $fillable = [
		'nom',
		'email',
		'motDePasse',
		'localite',
		'adresse',
		'codePostal',
		'numeroTelephone',
		'role',
		'statut',
		'dateCreation'
	];

	public function administrateurs()
	{
		return $this->hasMany(Administrateur::class, 'user_id');
	}

	public function declarations()
	{
		return $this->hasMany(Declaration::class, 'user_id');
	}

	public function entreprises()
	{
		return $this->hasMany(Entreprise::class, 'user_id');
	}

	public function notifications()
	{
		return $this->hasMany(Notification::class, 'user_id');
	}

	public function prives()
	{
		return $this->hasMany(Prive::class, 'user_id');
	}
}
