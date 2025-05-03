<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\AutreInformations; // Ensure this class exists in the specified namespace
use App\Models\AutrePersonneACharge;
use App\Models\Immobilier;
use App\Models\Banque;
use App\Models\Conjoint;
use App\Models\Revenu;
use App\Models\Titre;
use App\Models\User;
use App\Models\Enfant;
use App\Models\IndemniteAssurance;
use App\Models\Deduction;
use App\Models\InteretDettes;
use App\Models\PensionAlimentaire;
use App\Models\Rentier;
;


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
		'fo_independant' => 'boolean',
		'fo_indemnitesAssurance' => 'boolean',
		'fo_rentier' => 'boolean',
		'fo_autresRevenus' => 'boolean',
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
		'fo_independant',
		'fo_indemnitesAssurance',
		'fo_rentier',
		'fo_autresRevenus',
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

	public function revenus()
	{
		return $this->hasMany(Revenu::class, 'prive_id');
	}

	public function banques()
	{
		return $this->hasMany(Banque::class, 'prive_id');
	}

	public function titres()
	{
		return $this->hasMany(Titre::class, 'prive_id');
	}

	public function immobiliers()
	{
		return $this->hasMany(Immobilier::class, 'prive_id');
	}

	public function interetDettes()
	{
		return $this->hasMany(InteretDettes::class, 'prive_id');
	}

	public function indemniteAssurances()
	{
		return $this->hasMany(IndemniteAssurance::class, 'prive_id');
	}

	public function pensionAlimentaires()
	{
		return $this->hasMany(PensionAlimentaire::class, 'enfant_id');
	}


	public function autresInformations()
	{
		return $this->hasMany(AutreInformations::class, 'prive_id');
	}


	public function autresPersonnesACharge()
	{
		return $this->hasMany(AutrePersonneACharge::class, 'prive_id');
	}

	public function rentier()
	{
		return $this->hasMany(Rentier::class, 'prive_id');
	}

	public function deductions()
	{
		return $this->hasMany(Deduction::class, 'prive_id');
	}

}
