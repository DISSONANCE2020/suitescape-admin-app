<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActiveSessions extends Model
{
    use HasFactory;
    protected $table = 'active_sessions';


    protected $keyType = 'string';
    public $incrementing = false;
}
