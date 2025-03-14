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
 * @property Client $client
 *
 * @package App\Models
 */
class Entreprise extends Model
{
	protected $table = 'entreprise';
	protected $primaryKey = 'entreprise_id';
	public $timestamps = false;

	protected $casts = [
		'client_id' => 'int'
	];

	protected $fillable = [
		'client_id',
		'raison_sociale',
		'prestations',
		'nouvelle_entreprise',
		'grand_livre'
	];

	public function client()
	{
		return $this->belongsTo(Client::class);
	}
}
