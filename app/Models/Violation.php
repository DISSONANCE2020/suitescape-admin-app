<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Violation extends Model
{
    // Optionally specify the table if it's not the plural of the model name.
    protected $table = 'violations';

    protected $fillable = ['name']; // adjust fields as needed

    public function videos()
    {
        return $this->belongsToMany(Video::class, 'video_violations', 'violation_id', 'video_id');
    }
}
