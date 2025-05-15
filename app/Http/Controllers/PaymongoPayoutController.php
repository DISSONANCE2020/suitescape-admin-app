<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;


class PaymongoPayoutController extends Controller
{

    public function generatePaymentLink(Request $request)
    {
        $amount = $request->input('amount'); // Amount in PHP
        $uuid = (string) Str::uuid();

        if ($amount < 100) {
            return response()->json(['error' => 'Minimum amount is ₱100.00'], 422);
        }

        $amountInCentavos = (int) round($amount * 100);

        $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
            ->post('https://api.paymongo.com/v1/links', [
                'data' => [
                    'attributes' => [
                        'amount' => $amountInCentavos, // Convert PHP to centavos
                        'description' => 'Payout for Booking ID: ' . $request->input('booking_id'),
                        'reference_number' => $uuid,
                        'currency' => 'PHP',
                        'redirect' => [
                            'success' => url('/payout-success'),
                            'failed' => url('/payout-failed')
                        ],
                        'metadata' => [
                            'booking_id' => $request->input('booking_id'), // Include booking ID
                        
                        ],
                    ]
                ]
            ]);

        Log::info('Received PayMongo webhook');

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
