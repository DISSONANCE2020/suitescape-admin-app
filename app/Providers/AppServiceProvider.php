<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'appName' => config('app.name'),
            'csrf_token' => csrf_token(),

            // ✅ Share authenticated user data
            'auth' => function () {
                return [
                    'user' => Auth::user() ? [
                        'id' => Auth::user()->id,
                        'firstname' => Auth::user()->firstname,
                        'lastname' => Auth::user()->lastname,
                        'email' => Auth::user()->email,
                    ] : null,
                ];
            },

            // ✅ Share session flash messages (optional)
            'flash' => function () {
                return [
                    'success' => Session::get('success'),
                    'error' => Session::get('error'),
                ];
            },
        ]);
    }
}
