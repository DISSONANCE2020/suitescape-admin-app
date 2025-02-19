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
                    $query->select('violations.id');
                }
            ])->get()->map(function ($video) {
                return [
                    ...$video->toArray(),
                    'violations' => $video->violations->pluck('id')
                ];
            }),
            'listings' => Listing::all(),
            'users' => User::all(),
        ]);
    }


    public function updateStatus(Request $request, Video $video)
    {
        $video->update([
            'is_approved' => $request->is_approved,
            'updated_at' => now()
        ]);

        $video->violations()->sync($request->violations);

        return back()->with([
            'success' => 'Status updated',
            'videos' => Video::with([
                'violations' => function ($query) {
                    $query->select('violations.id');
                }
            ])->get()->map(function ($video) {
                return [
                    ...$video->toArray(),
                    'violations' => $video->violations->pluck('id')
                ];
            })
        ]);
    }

}
