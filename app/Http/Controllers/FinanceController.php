<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\User;
use App\Models\Listing;
use App\Models\PayoutMethod;
use App\Models\Invoice;

class FinanceController extends Controller
{
    public function payoutdetails()
    {
        // Fetch all necessary data
        $bookings = Booking::with('invoice')->latest()->get();
        $users = User::latest()->get();
        $listings = Listing::latest()->get();
        $payoutMethods = PayoutMethod::with('payoutable')->latest()->get();
        $invoices = Invoice::latest()->get();

        // Return data to the FinanceManager view
        return Inertia::render('FinanceManager', [
            'bookings' => $bookings,
            'users' => $users,
            'listings' => $listings,
            'payoutMethods' => $payoutMethods,
            'invoices' => $invoices,
        ]);
    }

    public function financeDashboard()
    {
        // Fetch payout methods with related data
        $payoutMethods = PayoutMethod::with(['payoutable', 'user'])->latest()->get();

        // Return data to the FinanceManagement view
        return Inertia::render('FinanceManagement', [
            'payoutMethods' => $payoutMethods,
        ]);
    }

    public function financeAdmin()
    {
        // Fetch finance data from the external API
        $response = Http::get('http://127.0.0.1:8001/api/bookings');

        // Check if the API call was successful
        $bookings = $response->successful() ? $response->json()['data'] : [];

        // Return data to the FinanceManager view
        return Inertia::render('FinanceManager', [
            'bookings' => $bookings,
        ]);
    }
}