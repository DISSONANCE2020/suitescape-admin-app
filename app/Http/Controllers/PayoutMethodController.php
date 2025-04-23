<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\PayoutMethod;
use Illuminate\Support\Facades\Http;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;


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
            'booking_id' => 'required|string|exists:bookings,id',
        ]);

        $amountInCents = (int) round($validated['amount'] * 100, 0);

        try {
            // Retrieve the invoice to get the reference_number
            $invoice = $this->getInvoiceByBookingId($validated['booking_id']);

            // Retrieve payment_id (id) using reference_number via API
            $paymentId = $this->getPaymentIdFromReferenceNumber($invoice->reference_number);

            $secretKey = env('PAYMONGO_SECRET_KEY');

            // Initiate the refund via PayMongo's Refunds API
            $response = Http::withBasicAuth($secretKey, '')
                ->post('https://api.paymongo.com/v1/refunds', [
                    'data' => [
                        'attributes' => [
                            'amount' => $amountInCents,
                            'payment_id' => $paymentId,
                            'reason' => 'requested_by_customer',
                            'notes' => $validated['description'] ?? 'Refund payment',
                        ],
                    ],
                ]);

            if ($response->successful()) {
                $refundData = $response->json()['data'];

                // Optionally, update the invoice status to 'refunded'
                $invoice->payment_status = 'refunded';
                $invoice->save();

                $this->logRefundDetails($refundData, $validated['booking_id'], $validated['amount']);

                return back()->with('success', 'Refund initiated successfully! Refund ID: ' . $refundData['id']);
            } else {
                $this->logError('Refund processing', new \Exception('Refund failed'), [
                    'booking_id' => $validated['booking_id'],
                    'user_id' => auth()->id(),
                    'response' => $response->body(),
                ]);
                return back()->with('error', 'Refund failed: ' . $response->json()['errors'][0]['detail'] ?? 'Unknown error');
            }
        } catch (\Exception $e) {
            $this->logError('Refund processing exception', $e, [
                'booking_id' => $validated['booking_id'] ?? null,
                'user_id' => auth()->id(),
            ]);
            return back()->with('error', 'Refund failed: ' . $e->getMessage());
        }
    }

    /**
     * Update the invoice status to "refunded" for a given booking
     *
     * @param string $bookingId
     * @return void
     */
    private function updateInvoiceStatus(string $bookingId)
    {
        try {
            $invoice = Invoice::where('booking_id', $bookingId)->first();

            if ($invoice) {
                $invoice->payment_status = 'refunded';
                $invoice->save();

                \Log::info("Invoice {$invoice->id} for booking {$bookingId} marked as refunded");
            } else {
                \Log::warning("No invoice found for booking {$bookingId}");
            }
        } catch (\Exception $e) {
            \Log::error("Failed to update invoice status for booking {$bookingId}: " . $e->getMessage());
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
            $this->logError('Transfer error', $e);

            // 🔁 Redirect back with error message
            return back()->with('error', 'Transfer failed: ' . $e->getMessage());
        }
    }

    /**
     * Validate and retrieve the invoice by booking ID.
     *
     * @param string $bookingId
     * @return Invoice
     * @throws \Exception
     */
    private function getInvoiceByBookingId(string $bookingId)
    {
        $invoice = Invoice::where('booking_id', $bookingId)->first();

        if (!$invoice || !$invoice->reference_number) {
            throw new \Exception('Payment ID not found for the provided booking ID.');
        }

        return $invoice;
    }

    /**
     * Retrieve payment_id (id) using reference_number via API.
     *
     * @param string $referenceNumber
     * @return string
     * @throws \Exception
     */
    private function getPaymentIdFromReferenceNumber(string $referenceNumber): string
    {
        $secretKey = env('PAYMONGO_SECRET_KEY');

        // Step 1: Retrieve the invoice using the reference_number
        $invoice = Invoice::where('reference_number', $referenceNumber)->first();

        if (!$invoice) {
            throw new \Exception('Invoice not found for the provided reference number.');
        }

        // Retrieve amount and description (fallback to bookings table if not present in invoices)
        $amount = $invoice->amount ?? 0;
        $description = $invoice->description ?? null;

        if ($amount <= 0 || !$description) {
            $booking = DB::table('bookings')->where('id', $invoice->booking_id)->first();

            if (!$booking || !$booking->amount || !$booking->message) {
                throw new \Exception('Amount or message is missing in both invoices and bookings tables.');
            }

            $amount = $booking->amount;
            $description = $booking->message;
        }

        // Convert amount to cents (integer)
        $amountInCents = (int) round($amount * 100, 0);

        $linkResponse = Http::withBasicAuth($secretKey, '')
            ->post('https://api.paymongo.com/v1/links', [
                'data' => [
                    'attributes' => [
                        'reference_number' => $referenceNumber,
                        'amount' => $amountInCents,
                        'description' => $description,
                    ],
                ],
            ]);

        if (!$linkResponse->successful()) {
            throw new \Exception('Failed to retrieve link_id: ' . $linkResponse->body());
        }

        $linkId = $linkResponse->json()['data']['id'] ?? null;

        if (!$linkId) {
            throw new \Exception('Link ID not found for the provided reference number.');
        }

        // Step 2: Retrieve the payment_id using the link_id
        $paymentResponse = Http::withBasicAuth($secretKey, '')
            ->get("https://api.paymongo.com/v1/links/{$linkId}");

        if (!$paymentResponse->successful()) {
            throw new \Exception('Failed to retrieve payment details: ' . $paymentResponse->body());
        }

        // Log the full response for debugging
        \Log::info('PayMongo Link API Response', [
            'link_id' => $linkId,
            'response' => $paymentResponse->json(),
        ]);

        $payments = $paymentResponse->json()['data']['attributes']['payments'] ?? [];

        if (empty($payments)) {
            throw new \Exception('No payments found for the provided link ID.');
        }

        // Extract the payment_id and check the payment status
        $payment = $payments[0]['data'] ?? null;

        if (!$payment || $payment['attributes']['status'] !== 'paid') {
            throw new \Exception('The payment is not completed. Refunds can only be processed for completed payments.');
        }

        return $payment['id'];
    }

    /**
     * Trace payment_id using reference_number.
     *
     * @param string $referenceNumber
     * @return string
     * @throws \Exception
     */
    private function tracePaymentId(string $referenceNumber): string
    {
        // Example logic to trace payment_id using reference_number
        // Replace this with actual implementation (e.g., API call or database query)
        $paymentRecord = DB::table('invoices')->where('reference_number', $referenceNumber)->first();

        if (!$paymentRecord || !$paymentRecord->payment_id) {
            throw new \Exception('Payment ID not found for the provided reference number.');
        }

        return $paymentRecord->payment_id;
    }

    /**
     * Log detailed refund information for traceability.
     *
     * @param array $refundData
     * @param string $bookingId
     * @param float $amount
     * @return void
     */
    private function logRefundDetails(array $refundData, string $bookingId, float $amount)
    {
        \Log::info("Refund initiated successfully", [
            'booking_id' => $bookingId,
            'amount' => $amount,
            'refund_id' => $refundData['id'],
            'processed_by' => auth()->id(),
        ]);
    }

    /**
     * Log errors consistently for refund and payout operations.
     *
     * @param string $context
     * @param \Exception $exception
     * @param array $additionalData
     * @return void
     */
    private function logError(string $context, \Exception $exception, array $additionalData = [])
    {
        \Log::error("{$context} error: " . $exception->getMessage(), $additionalData);
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
