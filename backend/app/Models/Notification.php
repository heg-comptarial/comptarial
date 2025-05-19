<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Class Notification
 * 
 * @property int $notification_id
 * @property int $user_id
 * @property string $contenu
 * @property Carbon $dateCreation
 * 
 * @property User $user
 *
 * @package App\Models
 */
class Notification extends Model
{
	use HasFactory;
	protected $table = 'notification';
	protected $primaryKey = 'notification_id';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'dateCreation' => 'datetime',
		'isRead' => 'boolean'

	];

	protected $fillable = [
		'user_id',
		'contenu',
		'dateCreation',
		'isRead'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'user_id');
	}

	public function markAsRead()
	{
		$this->isRead = true;
		$this->save();
	}

}
