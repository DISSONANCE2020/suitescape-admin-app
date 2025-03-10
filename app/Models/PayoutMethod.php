<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayoutMethod extends Model
{
    protected $table = 'payout_methods';
    protected $keyType = 'string';
    public $incrementing = false;
}
