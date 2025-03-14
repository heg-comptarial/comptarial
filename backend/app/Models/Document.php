<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Document
 * 
 * @property int $doc_id
 * @property int $sous_rub_id
 * @property string $titre
 * @property string $type
 * @property Carbon|null $date_ajout
 * @property string $chemin_fichier
 * @property string $statut
 * 
 * @property Sousrubrique $sousrubrique
 * @property Collection|Commentaire[] $commentaires
 *
 * @package App\Models
 */
class Document extends Model
{
	protected $table = 'document';
	protected $primaryKey = 'doc_id';
	public $timestamps = false;

	protected $casts = [
		'sous_rub_id' => 'int',
		'date_ajout' => 'datetime'
	];

	protected $fillable = [
		'sous_rub_id',
		'titre',
		'type',
		'date_ajout',
		'chemin_fichier',
		'statut'
	];

	public function sousrubrique()
	{
		return $this->belongsTo(Sousrubrique::class, 'sous_rub_id');
	}

	public function commentaires()
	{
		return $this->hasMany(Commentaire::class, 'doc_id');
	}
}
