<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Video;
use App\Models\User;
use App\Models\Listing;

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
        return parent::version($request) ?? md5_file(public_path('mix-manifest.json'));
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'firstname' => $request->user()->firstname,
                    'lastname' => $request->user()->lastname,
                    'email' => $request->user()->email,
                    'role_id' => $request->user()->role_id,
                ] : null,
            ],
            'videos' => fn() => Video::latest()->get(),  // Fetches the latest videos dynamically
            'users' => fn() => User::all(),  // Fetches all users dynamically
            'listings' => fn() => Listing::all(),  // Fetches all listings dynamically
            'version' => $this->version($request),
        ]);
    }
}
