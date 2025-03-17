<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayoutMethodDetail extends Model
{
    protected $table = 'payout_method_details';

    protected $fillable = [
        'status',
    ];
}
