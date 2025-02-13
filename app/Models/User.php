<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, HasRoles;

    public $incrementing = false;

    protected $casts = [
        'id' => 'string',
    ];

    protected $table = 'users';

    protected $fillable = [
        'id',
        'firstname',
        'lastname',
        'email',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $with = ['roles']; // Auto-load roles
}
