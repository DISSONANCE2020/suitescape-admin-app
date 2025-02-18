<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Video;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index()
    {
        return Inertia::render('ContentModerator', [
            'videos' => Video::with([
                'violations' => function ($query) {
                    $query->select('id');
                }
            ])->get()->map(function ($video) {
                return [
                    ...$video->toArray(),
                    'violations' => $video->violations->pluck('id') // Only return the violation IDs
                ];
            }),
            'listings' => Listing::all(),
            'users' => User::all(),
        ]);
    }

    public function updateStatus(Request $request, Video $video)
    {
        // Update the video's approval status
        $video->update([
            'is_approved' => $request->is_approved,
            'updated_at' => now()
        ]);

        // Sync the violations with the IDs provided in the request
        $video->violations()->sync($request->violations);

        // Return back with success message and updated videos data (with only violation IDs)
        return back()->with([
            'success' => 'Status updated',
            'videos' => Video::with('violations')->get()->map(function ($video) {
                return [
                    ...$video->toArray(),
                    'violations' => $video->violations->pluck('id')
                ];
            })
        ]);
    }
}
