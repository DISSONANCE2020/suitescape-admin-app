<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Database\Eloquent\Relations\Relation;
use Spatie\Permission\Middleware\RoleMiddleware;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
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

            'flash' => function () {
                return [
                    'success' => Session::get('success'),
                    'error'   => Session::get('error'),
                ];
            },

            Relation::morphMap([
                'gcash' => 'App\Models\GcashAccount'::class,
                'bank'  => 'App\Models\BankAccount'::class,
            ]),
        ]);
    }
}
