<?php


namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\Video;
use App\Models\Listing;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function contentModerator()
    {
        $user = Auth::user()->load('roles');

        $sharedAuth = Inertia::getShared('auth');

        return Inertia::render('ContentModerator', [
            'auth' => array_merge($sharedAuth, [
                'user' => [
                    'id' => $user->id,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                ],
            ]),
            'videos' => Video::latest()->get(),
            'users' => User::latest()->get(),
            'listings' => Listing::latest()->get(),
        ]);
    }
}
