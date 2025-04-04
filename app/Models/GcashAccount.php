<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GcashAccount extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'gcash_accounts';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the primary key.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'phone_number',
        'account_name',
    ];

    /**
     * Get the associated payout method for the GCash account.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphOne
     */
    public function payoutMethod()
    {
        return $this->morphOne(PayoutMethod::class, 'payoutable');
    }
}