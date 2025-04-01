<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
 * @property Rubrique $rubrique
 * @property Collection|Commentaire[] $commentaires
 *
 * @package App\Models
 */
class Document extends Model
{
	use HasFactory;
	protected $table = 'document';
	protected $primaryKey = 'doc_id';
	public $timestamps = false;

	protected $casts = [
		'rubrique_id' => 'int',
		'dateCreation' => 'datetime'
	];

	protected $fillable = [
		'rubrique_id',
		'nom',
		'type',
		'cheminFichier',
		'statut',
		'sous_rubrique',
		'dateCreation'
	];

	public function rubrique()
	{
		return $this->belongsTo(Rubrique::class, 'rubrique_id');
	}

	public function commentaires()
	{
		return $this->hasMany(Commentaire::class, 'document_id');
	}
}
