<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Listing extends Model
{
    use HasFactory;

    protected $table = 'listings';

    // Only include fields that should be mass-assignable
    protected $fillable = ['name', 'description', 'user_id'];

    // Disable auto-incrementing for the id field
    public $incrementing = false;

    // Cast the id field to a string
    protected $casts = [
        'id' => 'string',
    ];


}
