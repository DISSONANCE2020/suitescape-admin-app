<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\VideoViolationsController;


Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware(['auth', 'role:content-admin|super-admin'])->group(function () {
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

Route::get('/login', function () {
    return Inertia::render('Welcome');
})->name('login');

Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

Route::put('/videos/{id}/violations', [VideoViolationsController::class, 'update']);
Route::put('videos/{video}/violations', [VideoViolationsController::class, 'update']);
