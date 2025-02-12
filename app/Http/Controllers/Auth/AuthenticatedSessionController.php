<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthenticatedSessionController extends Controller
{
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            return back()->withErrors(['email' => 'Invalid login credentials.']);
        }

        $user = Auth::user()->load('roles');

        return Inertia::render('ContentModerator', [  // ✅ Render the ContentModerator page
            'user' => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'role_id' => optional($user->roles->first())->id,
            ],
            'message' => '✅ Login successful!',
        ]);
    }


}

