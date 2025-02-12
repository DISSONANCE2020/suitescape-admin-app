<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;


class User extends Authenticatable
{
    use HasFactory;

    use HasRoles;
    
    public $incrementing = false;

    // Cast the id field to a string
    protected $casts = [
        'id' => 'string',
    ];

    // Define the table name if it's different from the plural form of the model name
    protected $table = 'users';

    // Define only the fields you want to be mass assignable
    protected $fillable = [
        'id', 'firstname', 'lastname', // Only these fields
    ];

    // Optionally, you can define hidden attributes if you don't want certain fields serialized
    protected $hidden = [
        'password',
        'remember_token', 
    ];

    // Optionally, specify the data types for casting
    protected function casts(): array
    
    {
        return [
            // Define any casting as needed, like timestamps or booleans
        ];
    }
}
