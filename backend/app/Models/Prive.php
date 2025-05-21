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
		'fo_enfants' => 'boolean',
		'fo_autrePersonneCharge' => 'boolean',
		'fo_revenu' => 'boolean',
		'fo_rentier' => 'boolean',
		'fo_banques' => 'boolean',
		'fo_titres' => 'boolean',
		'fo_immobiliers' => 'boolean',
		'fo_dettes' => 'boolean',
		'fo_assurances' => 'boolean',
		'fo_autresDeductions' => 'boolean',
		'fo_autresInformations' => 'boolean',
	];

	protected $fillable = [
		'user_id',
		'dateNaissance',
		'nationalite',
		'etatCivil',
		'fo_enfants',
		'fo_autrePersonneCharge',
		'fo_revenu',
		'fo_rentier',
		'fo_banques',
		'fo_titres',
		'fo_immobiliers',
		'fo_dettes',
		'fo_assurances',
		'fo_autresDeductions',
		'fo_autresInformations',
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
