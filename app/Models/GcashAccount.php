<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GcashAccount extends Model
{
    protected $table = 'gcash_accounts';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'phone_number',
        'account_name',
    ];
    
    public function payoutMethod()
    {
        return $this->morphOne(PayoutMethod::class, 'payoutable');
    }
}