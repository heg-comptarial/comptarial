<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Formulaire
 * 
 * @property int $id
 * @property int $prive_id
 * @property int $declaration_id
 * @property string $titre_formulaire
 * @property string $banques
 * @property string $dettes
 * @property string $enfants
 * @property string $immobiliers
 * 
 * @property Prive $prive
 * @property Declaration $declaration
 *
 * @package App\Models
 */
class Formulaire extends Model
{
	protected $table = 'formulaire';
	public $timestamps = false;

	protected $casts = [
		'prive_id' => 'int',
		'declaration_id' => 'int'
	];

	protected $fillable = [
		'prive_id',
		'declaration_id',
		'titre_formulaire',
		'banques',
		'dettes',
		'enfants',
		'immobiliers'
	];

	public function prive()
	{
		return $this->belongsTo(Prive::class);
	}

	public function declaration()
	{
		return $this->belongsTo(Declaration::class);
	}
}
