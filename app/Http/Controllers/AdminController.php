<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Video;
use App\Models\Listing;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function contentModerator()
    {
        // Ensure the authenticated user has a role
        $user = Auth::user()->load('roles');

        return Inertia::render('ContentModerator', [
            'auth' => [
                'user' => $user,
                'role_id' => $user->roles->first()->id ?? null, // Ensure role_id is passed
            ],
            'videos' => Video::latest()->get(), // Fetch videos (modify as needed)
            'users' => User::latest()->get(), // Fetch all users
            'listings' => Listing::latest()->get(), // Fetch listings
        ]);
    }
}
