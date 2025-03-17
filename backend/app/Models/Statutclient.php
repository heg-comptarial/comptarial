<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatutClient extends Model
{
    use HasFactory;

    protected $table = 'StatutClient';  // Spécifier le nom de la table si nécessaire

    protected $fillable = [
        'client_id', 
        'statut', 
        'date_statut'
    ];

    // Si vous avez une relation avec la table Client
    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }
}
