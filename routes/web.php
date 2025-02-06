<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\VideoController;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/content-moderator', [VideoController::class, 'index'])->name('content.moderator');
//MAKE SURE TO CHECK IF TAMA ANG ROUTES



