<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function authenticated(Request $request, $user)
    {
        return response()->json([
            'user' => $user->load('roles'), // Ensures roles are loaded
            'role_id' => $user->role_id, // Return role_id
        ]);
    }
    }
