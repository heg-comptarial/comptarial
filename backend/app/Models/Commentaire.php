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
 * @property int $doc_id
 * @property int $admin_id
 * @property string $contenu
 * @property Carbon $date_creation
 * 
 * @property Document $document
 * @property Administrateur $administrateur
 *
 * @package App\Models
 */
class Commentaire extends Model
{
	protected $table = 'commentaire';
	protected $primaryKey = 'commentaire_id';
	public $timestamps = false;

	protected $casts = [
		'doc_id' => 'int',
		'admin_id' => 'int',
		'date_creation' => 'datetime'
	];

	protected $fillable = [
		'doc_id',
		'admin_id',
		'contenu',
		'date_creation'
	];

	public function document()
	{
		return $this->belongsTo(Document::class, 'doc_id');
	}

	public function administrateur()
	{
		return $this->belongsTo(Administrateur::class, 'admin_id');
	}
}
