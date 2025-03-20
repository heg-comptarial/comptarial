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
 * @property int $client_id
 * @property string $raison_sociale
 * @property string $prestations
 * @property string $nouvelle_entreprise
 * @property string $grand_livre
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
		'user_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'raison_sociale',
		'prestations',
		'nouvelle_entreprise',
		'grand_livre',
		'numeroFiscal'
	];

	public function client()
	{
		return $this->belongsTo(User::class);
	}
}
