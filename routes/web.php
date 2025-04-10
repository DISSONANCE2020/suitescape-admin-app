<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\VideoViolationsController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\PayoutMethodController;
use App\Http\Controllers\WebhookController;


Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/login', function () {
    return Inertia::render('Welcome');
})->name('login');

Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

Route::middleware(['auth', 'role:content-admin|super-admin'])->group(function () {
    Route::get('/content-moderator', [VideoController::class, 'contentModerator'])->name('content.moderator');
    Route::put('/videos/{video}/status', [VideoController::class, 'updateStatus']);
});

Route::middleware(['auth', 'role:super-admin'])->group(function () {
    Route::get('/super-admin', [SuperAdminController::class, 'superAdmin'])->name('super.admin');

    Route::get('/super-admin/finance', [FinanceController::class, 'financeDashboard'])->name('super.admin.finance');
    Route::get('/super-admin/payouts', [PayoutMethodController::class, 'index'])->name('super.admin.payouts');
    // Route::post('/super-admin/payout-methods/{payoutMethod}/transfer', [PayoutMethodController::class, 'transferFunds']);
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

Route::middleware(['auth', 'role:finance|super-admin'])->group(function (): void {
    Route::get('/finance-manager', [FinanceController::class, 'payoutdetails'])->name('finance.manager');
    Route::get('/finance-manager/dashboard', [FinanceController::class, 'financeDashboard'])->name('finance.dashboard');

    Route::get('/finance-manager/payouts', [PayoutMethodController::class, 'index'])->name('finance.payouts');
    Route::post('/finance-manager/payout-methods', [PayoutMethodController::class, 'store']);

    Route::post('/finance-manager/payout-methods/{payoutMethod}/transfer', [PayoutMethodController::class, 'transferFunds'])
        ->name('payout.transfer');
});

Route::post('/webhook/paymongo', [WebhookController::class, 'handle']);

if (app()->environment('local', 'development')) {
    Route::get('/debug-payouts', [PayoutMethodController::class, 'debug'])->middleware(['auth', 'role:super-admin']);
}
