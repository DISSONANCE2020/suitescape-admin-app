<?php
// File: app/Http/Controllers/AdminController.php


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
        // Load the authenticated user with their roles.
        $user = Auth::user()->load('roles');

        // Retrieve the shared 'auth' data from the global Inertia middleware.
        // This shared data is defined in your HandleInertiaRequests middleware.
        $sharedAuth = Inertia::getShared('auth');

        // Merge the shared auth data with updated user information.
        // This ensures that the front-end receives a consistent auth object,
        // including both the shared 'roles' and the updated 'user' details.
        return Inertia::render('ContentModerator', [
            'auth' => array_merge($sharedAuth, [
                'user' => [
                    'id' => $user->id,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                ],
            ]),
            'videos' => Video::latest()->get(), // Fetch videos (modify as needed)
            'users' => User::latest()->get(), // Fetch all users
            'listings' => Listing::latest()->get(), // Fetch listings
        ]);
    }
}
