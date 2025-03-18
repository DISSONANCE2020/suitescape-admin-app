<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\VideoViolationsController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\FinanceController;


Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/login', function () {
    return Inertia::render('Welcome');
})->name('login');

Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

Route::middleware(['auth', 'role:content-admin|super-admin|finance-admin'])->group(function () {
    Route::get('/content-moderator', [VideoController::class, 'contentModerator'])->name('content.moderator');
    Route::put('/videos/{video}/status', [VideoController::class, 'updateStatus']);
});

Route::middleware(['auth', 'role:super-admin'])->group(function () {
    Route::get('/super-admin', [SuperAdminController::class, 'superAdmin'])->name('super.admin');
    Route::put('/videos/{video}/status', [SuperAdminController::class, 'updateStatus']);
});

Route::get('/videos', function () {
    return Inertia::render('VideoManagement', [
        'videos' => \App\Models\Video::latest()->get(),
        'users' => \App\Models\User::latest()->get(),
        'listings' => \App\Models\Listing::latest()->get(),
    ]);
});

Route::put('/videos/{id}/violations', [VideoViolationsController::class, 'update']);
Route::put('videos/{video}/violations', [VideoViolationsController::class, 'update']);

Route::get('/finance', function () {
    $bookings = \App\Models\Booking::all();
    $users = \App\Models\User::all();
    $listings = \App\Models\Listing::all();
    $payout_methods = \App\Models\PayoutMethod::all();

    return Inertia::render('FinanceModerator', [
        'bookings' => $bookings,
        'users' => $users,
        'listings' => $listings,
        'payoutMethods' => $payout_methods,
    ]);
});
