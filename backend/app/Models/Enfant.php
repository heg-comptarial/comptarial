<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Class Enfant
 * 
 * @property int $id
 * @property int $prive_id
 * @property string $nom
 * @property string $prenom
 * @property Carbon $dateNaissance
 * @property string $adresse
 * @property string $codePostal
 * @property string $localite
 * @property string $noAVS
 * @property string $noContribuable
 * @property float $revenuBrut
 * @property float $fortuneNet
 * 
 * @property Prive $prive
 *
 * @package App\Models
 */
class Enfant extends Model
{
	use HasFactory;
	protected $table = 'enfants';
	public $timestamps = false;

	protected $casts = [
		'prive_id' => 'int',
		'dateNaissance' => 'datetime',
		'revenuBrut' => 'float',
		'fortuneNet' => 'float',
		'avantAgeScolaire' => 'boolean',
		'handicap' => 'boolean',
		'domicileAvecParents' => 'boolean',
		'parentsViventEnsemble' => 'boolean',
		'gardeAlternee' => 'boolean',
		'priseEnChargeFraisEgale' => 'boolean',
		'revenuNetSuperieurAAutreParent' => 'boolean',
		'montantInclusDansSalaireBrut' => 'boolean',
		'fo_scolaire' => 'boolean',
		'fo_scolaireStope' => 'boolean',
		'fo_certificatSalaire' => 'boolean',
		'fo_attestationFortune' => 'boolean',
		'fo_preuveVersementPensionAlim' => 'boolean',
		'fo_preuveEncaissementPensionAlim' => 'boolean',
		'fo_avanceScarpa' => 'boolean',
		'fo_fraisGardeEffectifs' => 'boolean',
		'fo_attestationAMPrimesAnnuel' => 'boolean',
		'fo_attestationAMFraisMedicaux' => 'boolean',
		'fo_attestationPaiementAssuranceAccident' => 'boolean',
	];

	protected $fillable = [
		'prive_id',
		'nom',
		'prenom',
		'dateNaissance',
		'adresse',
		'codePostal',
		'localite',
		'noAVS',
		'noContribuable',
		'revenuBrut',
		'fortuneNet',
		'avantAgeScolaire',
		'handicap',
		'domicileAvecParents',
		'parentsViventEnsemble',
		'gardeAlternee',
		'priseEnChargeFraisEgale',
		'revenuNetSuperieurAAutreParent',
		'fraisGarde',
		'primeAssuranceMaladie',
		'subsideAssuranceMaladie',
		'fraisMedicaux',
		'primeAssuranceAccident',
		'allocationsFamilialesSuisse',
		'montantInclusDansSalaireBrut',
		'allocationsFamilialesEtranger',
		'fo_scolaire',
		'fo_scolaireStope',
		'fo_certificatSalaire',
		'fo_attestationFortune',
		'fo_preuveVersementPensionAlim',
		'fo_preuveEncaissementPensionAlim',
		'fo_avanceScarpa',
		'fo_fraisGardeEffectifs',
		'fo_attestationAMPrimesAnnuel',
		'fo_attestationAMFraisMedicaux',
		'fo_attestationPaiementAssuranceAccident',
	];

	public function prive()
	{
		return $this->belongsTo(Prive::class, 'prive_id');
	}

	public function pensionsAlimentaires()
	{
		return $this->hasMany(PensionAlimentaire::class, 'enfant_id');
	}
}
