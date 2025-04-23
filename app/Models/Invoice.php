<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Invoice extends Model
{
    // Specify table name if not following Laravel's plural convention
    protected $table = 'invoices';

    // Using non-incrementing UUIDs
    public $incrementing = false;
    protected $keyType = 'string';

    // Define fillable attributes for mass-assignment
    protected $fillable = [
        'id', 
        'user_id', 
        'booking_id', 
        'payment_status',
        'reference_number',
    ];

    // Boot method to automatically generate UUIDs on model creation
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }
}
