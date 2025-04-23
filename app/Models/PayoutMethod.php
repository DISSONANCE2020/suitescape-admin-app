<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class PayoutMethod extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'payout_methods';

    /**
     * The data type of the primary key.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'payoutable_type',
        'payoutable_id',
        'transfer_status',
        'status',
        'is_default',
    ];

    /**
     * The attributes that should be appended to the model's array form.
     *
     * @var array
     */
    protected $appends = ['payoutable_type_key'];

    /**
     * Get the user associated with the payout method.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the related payoutable model (morph relationship).
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function payoutable()
    {
        return $this->morphTo();
    }

    /**
     * Set this payout method as the default for the user.
     *
     * @return void
     */
    public function setAsDefault()
    {
        $this->user->payoutMethods()->update(['is_default' => false]);
        $this->update(['is_default' => true]);
    }

    /**
     * Get the payoutable type key attribute.
     *
     * @return string
     */
    public function getPayoutableTypeKeyAttribute()
    {
        return match ($this->payoutable_type) {
            'App\\Models\\GcashAccount' => 'gcash',
            'App\\Models\\BankAccount' => 'bank',
            default => strtolower(class_basename($this->payoutable_type)),
        };
    }
}
