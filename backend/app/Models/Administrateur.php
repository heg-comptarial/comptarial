<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Administrateur
 * 
 * @property int $admin_id
 * @property int $utilisateur_id
 * @property string $niveau_acces
 * 
 * @property Utilisateur $utilisateur
 * @property Collection|Commentaire[] $commentaires
 *
 * @package App\Models
 */
class Administrateur extends Model
{
	protected $table = 'administrateur';
	protected $primaryKey = 'admin_id';
	public $timestamps = false;

	protected $casts = [
		'utilisateur_id' => 'int'
	];

	protected $fillable = [
		'utilisateur_id',
		'niveau_acces'
	];

	public function utilisateur()
	{
		return $this->belongsTo(Utilisateur::class);
	}

	public function commentaires()
	{
		return $this->hasMany(Commentaire::class, 'admin_id');
	}
}
