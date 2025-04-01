<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
/**
 * Class Administrateur
 * 
 * @property int $admin_id
 * @property int $user_id
 * @property string $niveauAcces
 * 
 * @property User $user
 * @property Collection|Commentaire[] $commentaires
 *
 * @package App\Models
 */
class Administrateur extends Model
{
	use HasFactory;
	protected $table = 'administrateur';
	protected $primaryKey = 'admin_id';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'niveauAcces'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'user_id');
	}

	public function commentaires()
	{
		return $this->hasMany(Commentaire::class, 'admin_id');
	}
}
