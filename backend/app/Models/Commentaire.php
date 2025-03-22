<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Commentaire
 * 
 * @property int $commentaire_id
 * @property int $document_id
 * @property int $admin_id
 * @property string $contenu
 * @property Carbon $dateCreation
 * 
 * @property Administrateur $administrateur
 * @property Document $document
 *
 * @package App\Models
 */
class Commentaire extends Model
{
	protected $table = 'commentaire';
	protected $primaryKey = 'commentaire_id';
	public $timestamps = false;

	protected $casts = [
		'document_id' => 'int',
		'admin_id' => 'int',
		'dateCreation' => 'datetime'
	];

	protected $fillable = [
		'document_id',
		'admin_id',
		'contenu',
		'dateCreation'
	];

	public function administrateur()
	{
		return $this->belongsTo(Administrateur::class, 'admin_id');
	}

	public function document()
	{
		return $this->belongsTo(Document::class);
	}
}
