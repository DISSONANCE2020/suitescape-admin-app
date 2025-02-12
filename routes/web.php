<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;


Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/videos', function () {
    return Inertia::render('VideoManagement', [
        'videos' => \App\Models\Video::all(),
        'users' => \App\Models\User::all(),
        'listings' => \App\Models\Listing::all(),
    ]);
});

// Fetch ALL necessary data in one controller
Route::get('/content-moderator', [VideoController::class, 'index'])->name('content.moderator');
Route::put('/videos/{video}/status', [VideoController::class, 'updateStatus']);

Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
