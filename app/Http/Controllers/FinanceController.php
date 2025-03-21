<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
class FinanceController extends Controller
{
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
            'bookings' => $bookings
        ]);
    }

    // public function updatePayoutStatus(Request $request, $id)
    // {
    //     $request->validate([
    //         'status' => ['required', 'string', 'in:payout pending,payout sent'],
    //     ]);

    //     $payoutMethodDetail = PayoutMethodDetail::findOrFail($id);
    //     $payoutMethodDetail->status = $request->input('status');
    //     $payoutMethodDetail->save();

    //     return response()->json($payoutMethodDetail);
    // }
}
