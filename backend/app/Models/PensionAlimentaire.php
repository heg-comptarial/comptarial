<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PensionAlimentaire extends Model
{
    use HasFactory;

    protected $table = 'pensionalimentaire';

    protected $primaryKey = 'pension_id';

    public $timestamps = false;

    protected $fillable = [
        'enfant_id',
        'statut',
        'montantContribution',
        'nom',
        'prenom',
        'noContribuable',
    ];

    // Relations
    public function enfant()
    {
        return $this->belongsTo(Enfant::class);
    }
}
