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
        $bookings = Booking::all();
        $users = User::all();
        $listings = Listing::all();
        $payoutMethods = PayoutMethod::with('payoutable')->get();
        $invoices = Invoice::all();
    
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
        return Inertia::render('FinanceManagement', [
            'payoutMethods' => PayoutMethod::with(['payoutable', 'user'])->get(),
        ]);
    }

    public function financeAdmin()
    {
        // Fetch finance data from the external API
        $response = Http::get('http://127.0.0.1:8001/api/bookings');

        // Check if the API call was successful
        if ($response->successful()) {
            $bookings = $response->json()['data'];
        } else {
            // Handle API failure case, like logging the error
            $bookings = [];
        }

        // Pass finance data to Inertia
        return Inertia::render('FinanceManager', [
            'bookings' => $bookings,
        ]);
    }
}
