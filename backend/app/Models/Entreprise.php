<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Entreprise
 * 
 * @property int $entreprise_id
 * @property int $user_id
 * @property string $raisonSociale
 * @property string $prestations
 * @property string $grandLivre
 * @property string $numeroFiscal
 * @property bool $nouvelleEntreprise
 * 
 * @property User $user
 *
 * @package App\Models
 */
class Entreprise extends Model
{
	protected $table = 'entreprise';
	protected $primaryKey = 'entreprise_id';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'nouvelleEntreprise' => 'bool'
	];

	protected $fillable = [
		'user_id',
		'raisonSociale',
		'prestations',
		'grandLivre',
		'numeroFiscal',
		'nouvelleEntreprise'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
