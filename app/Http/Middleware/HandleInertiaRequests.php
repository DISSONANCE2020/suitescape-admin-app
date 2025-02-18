<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Video;
use App\Models\User;
use App\Models\Listing;
use Illuminate\Support\Facades\DB;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request) ??
            (file_exists(public_path('mix-manifest.json')) ? md5_file(public_path('mix-manifest.json')) : null);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        // ✅ Fetch roles from model_has_roles
        $userRoles = [];
        if ($user) {
            $userRoles = DB::table('model_has_roles')
                ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->where('model_has_roles.model_id', $user->id)
                ->select('roles.id', 'roles.name')
                ->get()
                ->toArray();
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                ] : null,
                // ✅ Attach fetched roles
                'roles' => $userRoles,
            ],

            // 🚀 Other props (Do not edit these)
            // Updated to eager load the violations relationship so that each video includes its associated violation data.
            'videos' => fn() => Video::with('violations')->latest()->get(),
            'users' => fn() => User::all(),
            'listings' => fn() => Listing::all(),
            'model_has_roles' => DB::table('model_has_roles')->get(),

            'version' => $this->version($request),
        ]);
    }
}
