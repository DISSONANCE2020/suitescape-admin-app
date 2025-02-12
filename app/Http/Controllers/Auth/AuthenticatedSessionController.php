<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function store(Request $request)
    {
        // Validate input credentials
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Attempt login
        if (!Auth::attempt($credentials)) {
            return back()->withErrors(['email' => 'Invalid login credentials.']);
        }

        // Get authenticated user and their role
        $user = Auth::user()->load('roles');
        $roleId = optional($user->roles->first())->id;

        // Store user data in session for frontend access
        session([
            'user' => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'role_id' => $roleId,
            ]
        ]);

        // Redirect based on role
        if ($roleId === 4) {
            return Inertia::location('/content-moderator'); // Content Moderator
        } elseif ($roleId === 5) {
            return Inertia::location('/finance-admin'); // Finance Administrator
        }

        return Inertia::location('/dashboard'); // Default redirect
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        return Inertia::location('/'); // Redirect to home after logout
    }
}
