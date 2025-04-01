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
 * Class Prive
 * 
 * @property int $prive_id
 * @property int $user_id
 * @property Carbon $dateNaissance
 * @property string $nationalite
 * @property string $etatCivil
 * @property bool $fo_banques
 * @property bool $fo_dettes
 * @property bool $fo_immobiliers
 * @property bool $fo_salarie
 * @property bool $fo_autrePersonneCharge
 * @property bool $fo_independant
 * @property bool $fo_rentier
 * @property bool $fo_autreRevenu
 * @property bool $fo_assurance
 * @property bool $fo_autreDeduction
 * @property bool $fo_autreInformations
 * 
 * @property User $user
 * @property Collection|Conjoint[] $conjoints
 * @property Collection|Enfant[] $enfants
 *
 * @package App\Models
 */
class Prive extends Model
{
	use HasFactory;
	protected $table = 'prive';
	protected $primaryKey = 'prive_id';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'dateNaissance' => 'datetime',
		'fo_banques' => 'bool',
		'fo_dettes' => 'bool',
		'fo_immobiliers' => 'bool',
		'fo_salarie' => 'bool',
		'fo_autrePersonneCharge' => 'bool',
		'fo_independant' => 'bool',
		'fo_rentier' => 'bool',
		'fo_autreRevenu' => 'bool',
		'fo_assurance' => 'bool',
		'fo_autreDeduction' => 'bool',
		'fo_autreInformations' => 'bool'
	];

	protected $fillable = [
		'user_id',
		'dateNaissance',
		'nationalite',
		'etatCivil',
		'fo_banques',
		'fo_dettes',
		'fo_immobiliers',
		'fo_salarie',
		'fo_autrePersonneCharge',
		'fo_independant',
		'fo_rentier',
		'fo_autreRevenu',
		'fo_assurance',
		'fo_autreDeduction',
		'fo_autreInformations'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'user_id');
	}

	public function conjoints()
	{
		return $this->hasMany(Conjoint::class, 'prive_id');
	}

	public function enfants()
	{
		return $this->hasMany(Enfant::class, 'prive_id');
	}
}
