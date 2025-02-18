<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;

class VideoViolationsController extends Controller
{
    public function update(Request $request, $id, Video $video)
    {
        $video = Video::findOrFail($id);

        // Sync the violations using only the violation IDs passed in the request
        $video->violations()->sync($request->violations);

        // Reload the violations relationship to ensure the latest data
        $video->load('violations');

        // Return a redirect response with flash data for Inertia
        return redirect()->back()->with('flash', ['message' => 'Violations updated']);
    }
}
