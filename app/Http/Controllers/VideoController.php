<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Video;
use App\Models\Listing;
use App\Models\User;

class VideoController extends Controller
{
    public function index()
    {
        return Inertia::render('ContentModerator', [
            'videos' => Video::all(),
            'listings' => Listing::all(),
            'users' => User::all(),
        ]);
    }
    
}

