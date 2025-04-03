<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    protected $table = 'bank_accounts';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'account_number', 
        'bank_code',
        'account_name',
    ];
    
    public function payoutMethod()
    {
        return $this->morphOne(PayoutMethod::class, 'payoutable');
    }
}