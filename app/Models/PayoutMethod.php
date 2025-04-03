<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class PayoutMethod extends Model
{
    protected $table = 'payout_methods';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'payoutable_type',
        'payoutable_id',
        'status',
        'is_default'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function payoutable()
    {
        return $this->morphTo();
    }

    public function setAsDefault()
    {
        $this->user->payoutMethods()->update(['is_default' => false]);
        $this->update(['is_default' => true]);
    }
    protected $appends = ['payoutable_type_key'];

    public function getPayoutableTypeKeyAttribute()
    {
        return match ($this->payoutable_type) {
            'App\\Models\\GcashAccount' => 'gcash',
            'App\\Models\\BankAccount' => 'bank',
            default => strtolower(class_basename($this->payoutable_type)),
        };
    }

}
