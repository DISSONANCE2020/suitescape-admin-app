<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Video extends Model
{
    use HasFactory;

    protected $table = 'videos';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $casts = [
        'id' => 'string',
    ];

    protected $fillable = [
        'listing_id',
        'filename',
        'created_at',
        'is_approved'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Generate a UUID for 'id' if not already set
            if (!$model->id) {
                $model->id = (string) \Str::uuid();
            }
        });
    }

    public function violations()
    {
        return $this->belongsToMany(Violation::class, 'video_violations', 'video_id', 'violation_id');
    }

}

