<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Spatie\Permission\Middleware\RoleMiddleware; // Import Spatie's RoleMiddleware

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind the "role" alias so Laravel can resolve it during middleware termination.
        $this->app->bind('role', function ($app) {
            return $app->make(RoleMiddleware::class);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'appName' => config('app.name'),
            'csrf_token' => csrf_token(),

            // Share authenticated user data
            'auth' => function () {
                return [
                    'user' => Auth::user() ? [
                        'id'        => Auth::user()->id,
                        'firstname' => Auth::user()->firstname,
                        'lastname'  => Auth::user()->lastname,
                        'email'     => Auth::user()->email,
                    ] : null,
                ];
            },

            // Share session flash messages (optional)
            'flash' => function () {
                return [
                    'success' => Session::get('success'),
                    'error'   => Session::get('error'),
                ];
            },
        ]);
    }
}
