<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\PayoutMethod;
use App\Models\BankAccount;
use App\Models\GcashAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Luigel\Paymongo\Facades\Paymongo;


class PayoutMethodController extends Controller
{
    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $validated = $request->validate([
                'payoutable_type' => 'required|string',
                'payoutable_id' => 'required|string',
                'status' => 'nullable|string',
                'is_default' => 'nullable|boolean',
            ]);

            try {
                $payoutMethod = auth()->user()->payoutMethods()->create([
                    'id' => \Str::uuid(),
                    'payoutable_type' => $validated['payoutable_type'],
                    'payoutable_id' => $validated['payoutable_id'],
                    'status' => $validated['status'] ?? 'active',
                    'is_default' => $validated['is_default'] ?? false,
                ]);

                if ($payoutMethod->is_default) {
                    $payoutMethod->setAsDefault();
                }

                return back()->with('success', 'Payout method added successfully');
            } catch (\Exception $e) {
                \Log::error('Payout Method Creation Failed: ' . $e->getMessage());

                throw ValidationException::withMessages([
                    'general' => 'Failed to create payout method. Please try again.',
                ]);
            }
        });
    }

    public function update(PayoutMethod $payoutMethod, Request $request)
    {
        if (auth()->id() !== $payoutMethod->user_id) {
            abort(403, 'Unauthorized action');
        }

        $validated = $request->validate([
            'status' => 'nullable|string',
            'is_default' => 'nullable|boolean',
        ]);

        return DB::transaction(function () use ($payoutMethod, $validated, $request) {
            $payoutMethod->update([
                'status' => $validated['status'] ?? $payoutMethod->status,
                'is_default' => $validated['is_default'] ?? $payoutMethod->is_default,
            ]);

            if ($request->input('is_default')) {
                $payoutMethod->setAsDefault();
            }

            return back()->with('success', 'Payout method updated successfully');
        });
    }

    public function destroy(PayoutMethod $payoutMethod)
    {
        if (auth()->id() !== $payoutMethod->user_id) {
            abort(403, 'Unauthorized action');
        }

        try {
            $payoutMethod->delete();
            return back()->with('success', 'Payout method deleted successfully');
        } catch (\Exception $e) {
            \Log::error('Payout Method Deletion Failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to delete payout method');
        }
    }

    public function index()
    {
        $payoutMethods = auth()->user()->payoutMethods()->with('payoutable')->get();

        return Inertia::render('PayoutMethods/Index', [
            'payoutMethods' => $payoutMethods,
        ]);
    }

    public function transferFunds(Request $request, PayoutMethod $payoutMethod)
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

            return back()->with('success', 'Transfer successful! Reference: ' . $payment->id);
        } catch (\Exception $e) {
            \Log::error('Transfer error: ' . $e->getMessage());
            return back()->with('error', 'Transfer failed: ' . $this->simplifyErrorMessage($e->getMessage()));
        }
    }

    public function transferPayout(Request $request, PayoutMethod $payoutMethod)
    {
        // ✅ Authorization: Only allow users with roles 'finance-admin' or 'super-admin'
        // or the owner of the payout method to proceed. Others get 403 Forbidden.
        if (!auth()->user()->hasRole(['finance-admin', 'super-admin']) && auth()->id() !== $payoutMethod->user_id) {
            abort(403, 'Unauthorized action');
        }

        // ✅ Validate the incoming request data
        $validated = $request->validate([
            'amount' => 'required|numeric|min:100', // Amount is required, must be numeric and at least 100
            'description' => 'nullable|string|max:255', // Optional description, max 255 characters
        ]);

        // ✅ Convert amount to cents (PHP smallest unit is centavo)
        $amountInCents = (int) round($validated['amount'] * 100, 0);

        try {
            // ✅ Note: Since PayMongo does not currently support payouts directly,
            // this is a simulated payout action

            // 🔄 Simulate the logic as if the transfer was successful
            \Log::info('Simulated PayMongo Payout', [
                'user_id' => auth()->id(), // Log the current user's ID
                'payout_method_id' => $payoutMethod->id, // Log the payout method being used
                'amount' => $validated['amount'], // Log the amount requested
            ]);

            // ✅ Update the transfer status of the payout method to "sent"
            $payoutMethod->update([
                'transfer_status' => 'sent',
            ]);

            // ✅ Redirect back with a success message
            return back()->with('success', 'Simulated payout successful. Status updated to SENT.');
        } catch (\Exception $e) {
            // ❌ Handle any unexpected errors and log the message
            \Log::error('Transfer error: ' . $e->getMessage());

            // 🔁 Redirect back with error message
            return back()->with('error', 'Transfer failed: ' . $e->getMessage());
        }
    }


    private function getPayoutDetails(string $type, $payoutable): array
    {
        switch ($type) {
            case 'gcash':
                if (!isset($payoutable->phone_number)) {
                    throw new \Exception('Phone number is missing for the GCash account');
                }
                return ['phone_number' => $payoutable->phone_number];

            case 'bank_account':
                if (!isset($payoutable->account_number, $payoutable->bank_code, $payoutable->account_name)) {
                    throw new \Exception('Required bank account details are missing');
                }
                return [
                    'account_number' => $payoutable->account_number,
                    'bank_code' => $payoutable->bank_code,
                    'account_name' => $payoutable->account_name,
                ];

            default:
                throw new \Exception('Unsupported payout method');
        }
    }

    private function simplifyErrorMessage(string $message): string
    {
        if (str_contains($message, 'insufficient funds')) {
            return 'Insufficient balance for this transfer';
        }
        if (str_contains($message, 'bank account not found')) {
            return 'Invalid bank account details';
        }
        return 'Payment processing error - please try again';
    }
}
