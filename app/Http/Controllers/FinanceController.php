<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
class FinanceController extends Controller
{
    public function index()
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
        return Inertia::render('FinanceManagement', [
            'bookings' => $bookings
        ]);
    }
}
