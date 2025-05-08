<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use App\Models\PayoutMethod;
use App\Models\BankAccount;
use App\Models\GcashAccount;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class PaymongoController extends Controller
{
    public function generatePaymentLink(Request $request)
    {
        $amount = $request->input('amount'); // Amount in PHP
        $uuid = (string) Str::uuid();
        $bookingId = $request->input('booking_id');

        if ($amount < 100) {
            return response()->json(['error' => 'Minimum amount is ₱100.00'], 422);
        }

        $amountInCentavos = (int) round($amount * 100);

        $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
            ->post('https://api.paymongo.com/v1/links', [
                'data' => [
                    'attributes' => [
                        'amount' => $amountInCentavos, // Convert PHP to centavos
                        'description' => 'Booking ID: ' . $bookingId,
                        'reference_number' => $uuid,
                        'currency' => 'PHP',
                        'redirect' => [
                            'success' => url('/payout-success'),
                            'failed' => url('/payout-failed')
                        ],
                        'metadata' => [
                            'booking_id' => $bookingId,
                            'pm_reference_number' => $uuid,
                        ],
                    ]
                ]
            ]);

        if ($response->successful()) {
            return response()->json([
                'link' => $response['data']['attributes']['checkout_url'],
            ]);
        }

        return response()->json([
            'error' => $response->json(),
        ], 500);
    }
}
