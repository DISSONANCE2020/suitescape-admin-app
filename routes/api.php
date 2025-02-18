<?php

use App\Models\Video;
use Illuminate\Http\Request;

Route::put('/videos/{id}/status', function ($id, Request $request) {
    $validated = $request->validate([
        'status' => 'nullable|in:0,1',
    ]);

    $video = Video::find($id);

    if (!$video) {
        return response()->json(['message' => 'Video not found'], 404);
    }

    $video->status = $validated['status'] ?? null;
    $video->save();

    return response()->json($video);
});
