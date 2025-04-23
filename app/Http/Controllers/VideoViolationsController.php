<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;

class VideoViolationsController extends Controller
{
    public function update(Request $request, $id)
    {
        $video = Video::findOrFail($id);

        $validated = $request->validate([
            'violations' => 'required|array',
        ]);

        try {
            $video->violations()->sync($validated['violations']);
            $video->load('violations');

            return redirect()->back()->with('flash', ['message' => 'Violations updated']);
        } catch (\Exception $e) {
            \Log::error('Failed to update video violations: ' . $e->getMessage());

            return redirect()->back()->with('flash', ['error' => 'Failed to update violations. Please try again.']);
        }
    }
}
