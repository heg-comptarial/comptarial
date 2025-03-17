<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
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
 * @property Collection|Declaration[] $declarations
 * @property Collection|Entreprise[] $entreprises
 * @property Collection|Prive[] $prives
 * @property Collection|Statutclient[] $statutclients
 *
 * @package App\Models    
 */
class Client extends Model
{

	use HasFactory;
	protected $table = 'client';
	protected $primaryKey = 'client_id';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int'
	];

	protected $fillable = [
		'user_id', // user id de laravel
		'type_entreprise',
		'adresse',
		'numero_fiscal'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function declarations()
	{
		return $this->hasMany(Declaration::class);
	}

	public function entreprises()
	{
		return $this->hasOne(Entreprise::class);
	}

	public function prives()
	{
		return $this->hasOne(Prive::class);
	}

	public function statutclients()
	{
		return $this->hasOne(Statutclient::class);
	}
}
