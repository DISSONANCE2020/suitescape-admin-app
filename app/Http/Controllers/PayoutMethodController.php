<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PayoutMethod;
use App\Models\BankAccount;
use App\Models\GcashAccount;
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
                'is_default' => 'nullable|boolean'
            ]);

            try {
                $payoutMethod = auth()->user()->payoutMethods()->create([
                    'id' => \Str::uuid(),
                    'payoutable_type' => $validated['payoutable_type'],
                    'payoutable_id' => $validated['payoutable_id'],
                    'status' => $validated['status'] ?? 'active',
                    'is_default' => $validated['is_default'] ?? false
                ]);

                if ($payoutMethod->is_default) {
                    $payoutMethod->setAsDefault();
                }

                return back()->with('success', 'Payout method added successfully');
            } catch (\Exception $e) {
                \Log::error('Payout Method Creation Failed: ' . $e->getMessage());

                throw ValidationException::withMessages([
                    'general' => 'Failed to create payout method. Please try again.'
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
            'is_default' => 'nullable|boolean'
        ]);

        return DB::transaction(function () use ($payoutMethod, $validated, $request) {
            $payoutMethod->update([
                'status' => $validated['status'] ?? $payoutMethod->status,
                'is_default' => $validated['is_default'] ?? $payoutMethod->is_default
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

        return Inertia::render(
            'PayoutMethods/Index',
            [
                'payoutMethods' => $payoutMethods
            ]
        );
    }

    // THIS IS TEMPORARY FOR DEBUGGING PURPOSES ONLY - REMOVE THIS IN PRODUCTION
    public function debug()
    {
        $payoutMethods = auth()->user()->payoutMethods()->with('payoutable')->get();
        return response()->json($payoutMethods);
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
            $details = [];

            switch ($type) {
                case 'gcash':
                    if (!isset($payoutable->phone_number)) {
                        throw new \Exception('Phone number is missing for the GCash account');
                    }
                    $details['phone_number'] = $payoutable->phone_number;
                    break;
                case 'bank_account':
                    if (!isset($payoutable->account_number, $payoutable->bank_code, $payoutable->account_name)) {
                        throw new \Exception('Required bank account details are missing');
                    }
                    $details = [
                        'account_number' => $payoutable->account_number,
                        'bank_code' => $payoutable->bank_code,
                        'account_name' => $payoutable->account_name,
                    ];
                    break;
            }

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

    private function simplifyErrorMessage($message)
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
