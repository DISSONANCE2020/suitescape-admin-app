<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\FinanceController;


Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware(['auth', 'role:content-admin'])->group(function () {
    Route::get('/content-moderator', [VideoController::class, 'contentModerator'])->name('content.moderator');
    Route::put('/videos/{video}/status', [VideoController::class, 'updateStatus']);
});

Route::get('/videos', function () {
    return Inertia::render('VideoManagement', [
        'videos' => \App\Models\Video::latest()->get(),
        'users' => \App\Models\User::latest()->get(),
        'listings' => \App\Models\Listing::latest()->get(),
    ]);
});

// Fetch ALL necessary data in one controller
Route::get('/content-moderator', [VideoController::class, 'index'])->name('content.moderator');
Route::put('/videos/{video}/status', [VideoController::class, 'updateStatus']);

Route::get('/finance', function () {
    $bookings = \App\Models\Booking::all();
    $users = \App\Models\User::all();
    $listings = \App\Models\Listing::all();
    $payout_methods = \App\Models\PayoutMethod::all();
    $payout_method_details = \App\Models\PayoutMethodDetail::all();

    return Inertia::render('FinanceModerator', [
        'bookings' => $bookings,
        'users' => $users,
        'listings' => $listings,
        'payoutMethods' => $payout_methods,
        'payoutMethodDetails' => $payout_method_details,
    ]);
});

