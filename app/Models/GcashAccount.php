<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GcashAccount extends Model
{
    protected $table = 'gcash_accounts';
    
    public function payoutMethod()
    {
        return $this->morphOne(PayoutMethod::class, 'payoutable');
    }
}