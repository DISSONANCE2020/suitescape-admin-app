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

    // Update video status
    public function updateStatus(Request $request, Video $video)
    {
        $request->validate([
            'is_approved' => 'nullable|integer',
            'updated_at' => 'nullable|date',
        ]);

        $video->update([
            'is_approved' => $request->is_approved,
            'updated_at' => now(),
        ]);

        // Instead of redirecting to a new page, stay on the current route with updated data
        return back()->with([
            'success' => 'Video status updated successfully',
            'updatedVideo' => $video,
        ]);
    }


}

