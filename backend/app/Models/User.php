<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 
        'email', 
        'mot_de_passe', 
        'date_creation', 
        'localite', 
        'adresse', 
        'code_postal', 
        'numero_telephone', 
        'role',
    ];

    protected $hidden = [
        'mot_de_passe', 
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function administrateurs()
	{
		return $this->hasOne(Administrateur::class);
	}

	public function clients()
	{
		return $this->hasOne(Client::class);
	}

	public function notifications()
	{
		return $this->hasMany(Notification::class);
	}
}
