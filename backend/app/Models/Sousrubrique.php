<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Sousrubrique
 * 
 * @property int $sous_rub_id
 * @property int $rubrique_id
 * @property string $titre
 * @property string $description
 * 
 * @property Rubrique $rubrique
 * @property Collection|Document[] $documents
 *
 * @package App\Models
 */
class Sousrubrique extends Model
{
	protected $table = 'sousrubrique';
	protected $primaryKey = 'sous_rub_id';
	public $timestamps = false;

	protected $casts = [
		'rubrique_id' => 'int'
	];

	protected $fillable = [
		'rubrique_id',
		'titre',
		'description'
	];

	public function rubrique()
	{
		return $this->belongsTo(Rubrique::class);
	}

	public function documents()
	{
		return $this->hasMany(Document::class, 'sous_rub_id');
	}
}
