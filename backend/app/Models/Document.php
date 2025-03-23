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
 * @property string $cheminFichier
 * @property string $statut
 * @property Carbon $dateCreation
 * 
 * @property SousRubrique $sous_rubrique
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
		'dateCreation' => 'datetime'
	];

	protected $fillable = [
		'sous_rub_id',
		'titre',
		'type',
		'cheminFichier',
		'statut',
		'dateCreation'
	];

	public function sous_rubrique()
	{
		return $this->belongsTo(SousRubrique::class, 'sous_rub_id');
	}

	public function commentaires()
	{
		return $this->hasMany(Commentaire::class, 'document_id');
	}
}
