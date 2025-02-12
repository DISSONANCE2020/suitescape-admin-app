<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $roleId)
    {
        if (!Auth::check()) {
            abort(403, 'Unauthorized access');
        }

        // Get the user's ID
        $userId = Auth::id();

        // Check if the user has the given role_id in model_has_roles
        $hasRole = DB::table('model_has_roles')
            ->where('model_id', $userId)  // model_id is the user ID
            ->where('role_id', $roleId)   // role_id should match the required one
            ->exists();

        if (!$hasRole) {
            abort(403, 'Unauthorized access');
        }

        return $next($request);
    }
}
