<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class Declaration
 * 
 * @property int $declaration_id
 * @property int $client_id
 * @property string $titre
 * @property Carbon $date_creation
 * @property string $statut
 * 
 * @property Collection|Formulaire[] $formulaires
 * @property Collection|Rubrique[] $rubriques
 *
 * @package App\Models
 */
class Declaration extends Model
{
	protected $table = 'declaration';
	protected $primaryKey = 'declaration_id';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'titre',
		'date_creation',
		'statut'
	];

	public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }


	public function formulaires()
	{
		return $this->hasOne(Formulaire::class);
	}

	public function rubriques()
	{
		return $this->hasMany(Rubrique::class);
	}
}
