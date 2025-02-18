<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;

class VideoViolationsController extends Controller
{
    public function update(Request $request, $id, Video $video)
    {
        $video = Video::findOrFail($id);

        $video->violations()->sync($request->violations);

        $video->load('violations');

        return redirect()->back()->with('flash', ['message' => 'Violations updated']);
    }
}
