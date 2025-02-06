<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Video;

class VideoController extends Controller
{
    public function index(): Response
    {
        // Fetch video data from the database
        $videos = Video::all(); 

        // Pass videos to Inertia
        return Inertia::render('ContentModerator', [
            'videos' => $videos
        ]);
    }
}
