<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Utilisateur
 * 
 * @property int $utilisateur_id
 * @property string $nom
 * @property string $email
 * @property string $mot_de_passe
 * @property Carbon $date_creation
 * @property string $localite
 * @property string $adresse
 * @property string $code_postal
 * @property string $numero_telephone
 * 
 * @property Collection|Administrateur[] $administrateurs
 * @property Collection|Client[] $clients
 * @property Collection|Notification[] $notifications
 *
 * @package App\Models
 */
class Utilisateur extends Model
{
	protected $table = 'utilisateur';
	protected $primaryKey = 'utilisateur_id';
	public $timestamps = false;

	protected $casts = [
		'date_creation' => 'datetime'
	];

	protected $fillable = [
		'nom',
		'email',
		'mot_de_passe',
		'date_creation',
		'localite',
		'adresse',
		'code_postal',
		'numero_telephone'
	];

	public function administrateurs()
	{
		return $this->hasOne(Administrateur::class);
	}

	public function clients()
	{
		return $this->hasOne(Client::class);
	}

	public function notifications()
	{
		return $this->hasMany(Notification::class);
	}
}
