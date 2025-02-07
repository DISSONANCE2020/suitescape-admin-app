<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\VideoController;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Fetch ALL necessary data in one controller
Route::get('/content-moderator', [VideoController::class, 'index'])->name('content.moderator');


