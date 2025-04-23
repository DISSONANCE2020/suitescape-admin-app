<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\PayoutMethod;
use App\Models\BankAccount;
use App\Models\GcashAccount;

class PaymongoController extends Controller
{

    public function transferPayout(Request $request, PayoutMethod $payoutMethod)
    {
        if (!auth()->user()->hasRole(['finance-admin', 'super-admin']) && auth()->id() !== $payoutMethod->user_id) {
            abort(403, 'Unauthorized action');
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:100',
            'description' => 'nullable|string|max:255',
        ]);

        $amountInCents = (int) round($validated['amount'] * 100, 0);

        try {
            $payoutMethod->loadMissing('payoutable');
            $payoutable = $payoutMethod->payoutable;

            if (!$payoutable) {
                throw new \Exception('Payoutable record not found for this payout method');
            }

            $typeMap = [
                GcashAccount::class => 'gcash',
                BankAccount::class => 'bank_account',
            ];

            if (!isset($typeMap[get_class($payoutable)])) {
                throw new \Exception('Unsupported payout method');
            }

            $type = $typeMap[get_class($payoutable)];
            $details = $this->getPayoutDetails($type, $payoutable);

            $payment = Paymongo::payment()->create([
                'amount' => $amountInCents,
                'currency' => 'PHP',
                'destination' => [
                    'type' => $type,
                    'details' => $details,
                ],
                'description' => $validated['description'] ?? 'Funds transfer',
            ]);

            $payoutMethod->update([
                'transfer_status' => 'sent',
            ]);

            return back()->with('success', 'Transfer successful! Reference: ' . $payment->id);
        } catch (\Exception $e) {
            \Log::error('Transfer error: ' . $e->getMessage());
            return back()->with('error', 'Transfer failed: ' . $this->simplifyErrorMessage($e->getMessage()));
        }
    }
    public function generatePaymentLink(Request $request)
    {
        $amount = $request->input('amount'); // in PHP, e.g. 4510.50
        $uuid = (string) Str::uuid();


        if ($amount < 100) {
            return response()->json(['error' => 'Minimum amount is ₱100.00'], 422);
        }


        $amountInCentavos = (int) round($amount * 100);

        $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
            ->post('https://api.paymongo.com/v1/links', [
                'data' => [
                    'attributes' => [
                        'amount' => $amountInCentavos, // convert PHP to centavos
                        'description' => 'Payout for Booking ID: ' . $request->input('booking_id'),
                        'reference_number' => $uuid,
                        'currency' => 'PHP',
                        'redirect' => [
                            'success' => url('/payout-success'),
                            'failed' => url('/payout-failed')
                        ]
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
