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
    // public function transferPayout(Request $request, User $user, PayoutMethod $payoutMethod)
    // {
    //     if (
    //         !$user->hasRole(['finance-admin', 'super-admin']) && $user->id !== $payoutMethod->user_id
    //     ) {
    //         abort(403, 'Unauthorized action');
    //     }

    //     $validated = $request->validate([
    //         'amount' => 'required|numeric|min:100',
    //         'description' => 'nullable|string|max:255',
    //     ]);

    //     $amountInCents = (int) round($validated['amount'] * 100, 0);

    //     try {
    //         $payoutMethod->loadMissing('payoutable');
    //         $payoutable = $payoutMethod->payoutable;

    //         if (!$payoutable) {
    //             throw new \Exception('Payoutable record not found for this payout method');
    //         }

    //         $typeMap = [
    //             GcashAccount::class => 'gcash',
    //             BankAccount::class => 'bank_account',
    //         ];

    //         if (!isset($typeMap[get_class($payoutable)])) {
    //             throw new \Exception('Unsupported payout method');
    //         }

    //         $type = $typeMap[get_class($payoutable)];
    //         $details = match ($type) {
    //             'gcash' => [
    //                 'phone_number' => $payoutable->phone_number,
    //             ],
    //             'bank_account' => [
    //                 'bank_code' => $payoutable->bank_code,
    //                 'account_number' => $payoutable->account_number,
    //             ],
    //             default => throw new \Exception('Unsupported payout method'),
    //         };

    //         $payment = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
    //             ->post('https://api.paymongo.com/v1/payments', [
    //                 'data' => [
    //                     'attributes' => [
    //                         'amount' => $amountInCents,
    //                         'currency' => 'PHP',
    //                         'destination' => [
    //                             'type' => $type,
    //                             'details' => $details,
    //                         ],
    //                         'description' => $validated['description'] ?? 'Funds transfer',
    //                     ]
    //                 ]
    //             ])->json();

    //         return back()->with('success', 'Transfer successful! Reference: ' . ($payment['data']['id'] ?? 'N/A'));
    //     } catch (\Exception $e) {
    //         Log::error('Transfer error: ' . $e->getMessage());
    //         return back()->with('error', 'Transfer failed: ' . $e->getMessage());
    //     }
    // }

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
