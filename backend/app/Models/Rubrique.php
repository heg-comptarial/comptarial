<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Class Rubrique
 * 
 * @property int $rubrique_id
 * @property int $declaration_id
 * @property string $titre
 * @property string $description
 * 
 * @property Declaration $declaration
 * @property Collection|Document[] $document
 *
 * @package App\Models
 */
class Rubrique extends Model
{
	use HasFactory;
	protected $table = 'rubrique';
	protected $primaryKey = 'rubrique_id';
	public $timestamps = false;

	protected $casts = [
		'declaration_id' => 'int'
	];

	protected $fillable = [
		'declaration_id',
		'titre',
		'description'
	];

	public function declaration()
	{
		return $this->belongsTo(Declaration::class, 'declaration_id');
	}

	public function documents()
	{
		return $this->hasMany(Document::class, 'rubrique_id');
	}
}
