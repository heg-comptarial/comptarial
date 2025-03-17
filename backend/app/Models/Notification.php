<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Notification
 * 
 * @property int $notification_id
 * @property int $user_id
 * @property string $type_notif
 * @property string $contenu
 * @property Carbon $date_envoi
 * @property string $lecture_statut
 * 
 * @property User $user
 *
 * @package App\Models
 */
class Notification extends Model
{
	protected $table = 'notification';
	protected $primaryKey = 'notification_id';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'date_envoi' => 'datetime'
	];

	protected $fillable = [
		'user_id',
		'type_notif',
		'contenu',
		'date_envoi',
		'lecture_statut'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
