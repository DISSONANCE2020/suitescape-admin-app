<?php

use App\Models\Video;
use Illuminate\Http\Request;

Route::put('/videos/{id}/status', function ($id, Request $request) {
    // Validate status input (1 = approved, 0 = rejected, null = pending)
    $validated = $request->validate([
        'status' => 'nullable|in:0,1',
    ]);

    // Find the video by ID
    $video = Video::find($id);

    // If video not found, return an error
    if (!$video) {
        return response()->json(['message' => 'Video not found'], 404);
    }

    // Update the video status
    $video->status = $validated['status'] ?? null; // Default to null if no status provided
    $video->save();

    return response()->json($video); // Return the updated video
});
