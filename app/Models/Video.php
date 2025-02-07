<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Video extends Model
{
    use HasFactory;

    protected $table = 'videos';

    // Disable auto-incrementing for the 'id' field as it's a string (UUID)
    public $incrementing = false;

    // Set 'id' to be a string (CHAR(36)) in the database
    protected $keyType = 'string';

    // Cast 'id' to string to ensure it is properly handled when accessed
    protected $casts = [
        'id' => 'string',
    ];

    // You don't need to include 'id' in $fillable as it's auto-managed by Eloquent
    protected $fillable = [
        'listing_id',
        'filename',
        'created_at',
        'status'
    ];

    // Optionally, if you want to automatically generate a UUID for the 'id' field if not provided
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
}

