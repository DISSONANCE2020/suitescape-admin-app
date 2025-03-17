<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Listing extends Model
{
    use HasFactory;

    protected $table = 'listings';

    protected $fillable = ['name', 'description', 'user_id', 'facility_type'];

    public $incrementing = false;

    protected $casts = [
        'id' => 'string',
    ];


}
