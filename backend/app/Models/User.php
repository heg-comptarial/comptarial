<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'user';
    protected $primaryKey = 'user_id';

    protected $fillable = [
        'nom', 'email', 'motDePasse', 'dateCreation',
        'localite', 'adresse', 'codePostal', 'NumeroTelephone',
        'role', 'statut'
    ];

    protected $hidden = ['motDePasse', 'remember_token'];

    public function administrateur(): HasOne
    {
        return $this->hasOne(Administrateur::class, 'user_id');
    }

    public function prive(): HasOne
    {
        return $this->hasOne(Prive::class, 'user_id');
    }

    public function entreprise(): HasOne
    {
        return $this->hasOne(Entreprise::class, 'user_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function declarations(): HasMany
    {
        return $this->hasMany(Declaration::class, 'user_id');
    }
}
