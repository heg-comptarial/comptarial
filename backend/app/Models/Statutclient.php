<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Statutclient
 * 
 * @property int $statut_id
 * @property int $client_id
 * @property string $nom
 * 
 * @property Client $client
 *
 * @package App\Models
 */
class Statutclient extends Model
{
	protected $table = 'statutclient';
	protected $primaryKey = 'statut_id';
	public $timestamps = false;

	protected $casts = [
		'client_id' => 'int'
	];

	protected $fillable = [
		'client_id',
		'nom'
	];

	public function client()
	{
		return $this->belongsTo(Client::class);
	}
}
