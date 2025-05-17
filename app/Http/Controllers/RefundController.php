<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\PayoutMethod;
use Illuminate\Support\Facades\Http;
use App\Models\Invoice;
use Illuminate\Http\Request;


class RefundController extends Controller
{

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
                $invoice->payment_status = 'fully_refunded';
                $invoice->save();

                $this->logRefundDetails($refundData, $validated['booking_id'], $validated['amount'], $validated['moderated_by'] ?? null);

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

    public function processPartialRefund(Request $request)
    {
        $validated = $request->validate(
            [
                'amount' => 'required|numeric|min:100',
                'description' => 'nullable|string|max:255',
                'booking_id' => 'required|string|exists:bookings,id',
            ]
        );

        $amountInCents = (int) round($validated['amount'] * 100 * 0.8, 0);

        try {
            $invoice = $this->getInvoiceByBookingId($validated['booking_id']);

            $paymentId = $this->getPaymentIdFromReferenceNumber($invoice->reference_number);

            $secretKey = env('PAYMONGO_SECRET_KEY');

            $paymentDetails = Http::withBasicAuth($secretKey, '')
                ->get("https://api.paymongo.com/v1/payments/{$paymentId}");

            $paymentData = $paymentDetails->json()['data']['attributes'] ?? [];
            $paymentStatus = $paymentData['status'] ?? null;

            \Log::info('Partial refund debug', [
                'requested_amount' => $amountInCents,
                'payment_status' => $paymentStatus,
            ]);

            if ($paymentStatus !== 'paid') {
                return back()->with('error', 'Refunds can only be processed for completed (paid) payments.');
            }

            $response = Http::withBasicAuth($secretKey, '')
                ->post('https://api.paymongo.com/v1/refunds', [
                    'data' => [
                        'attributes' => [
                            'amount' => $amountInCents,
                            'payment_id' => $paymentId,
                            'reason' => 'requested_by_customer',
                            'notes' => $validated['description'] ?? 'Partial refund payment',
                        ],
                    ],
                ]);

            if ($response->successful()) {
                $refundData = $response->json()['data'];

                $invoice->payment_status = 'partially_refunded';
                $invoice->save();

                $this->logRefundDetails($refundData, $validated['booking_id'], $validated['amount'] * 0.8, $validated['moderated_by'] ?? null);

                return back()->with('success', 'Partial refund initiated successfully! Refund ID: ' . $refundData['id']);
            } else {
                $this->logError('Partial refund processing', new \Exception('Partial refund failed'), [
                    'booking_id' => $validated['booking_id'],
                    'user_id' => auth()->id(),
                    'response' => $response->body(),
                ]);
                return back()->with('error', 'Partial refund failed: ' . $response->json()['errors'][0]['detail'] ?? 'Unknown error');
            }
        } catch (\Exception $e) {
            $this->logError('Partial refund processing exception', $e, [
                'booking_id' => $validated['booking_id'] ?? null,
                'user_id' => auth()->id(),
            ]);
            return back()->with('error', 'Partial refund failed: ' . $e->getMessage());
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

        try {
            // Make a GET request to the PayMongo API to retrieve the link details
            $response = Http::withBasicAuth($secretKey, '')
                ->get("https://api.paymongo.com/v1/links/{$referenceNumber}");

            if (!$response->successful()) {
                throw new \Exception('Failed to retrieve link details: ' . $response->body());
            }

            // Parse the response to extract the payments array
            $payments = $response->json()['data']['attributes']['payments'] ?? [];

            if (empty($payments)) {
                throw new \Exception('No payments found for the provided reference number.');
            }

            // Extract the payment_id from the first payment in the array
            $payment = $payments[0]['data'] ?? null;

            if (!$payment || $payment['attributes']['status'] !== 'paid') {
                throw new \Exception('The payment is not completed. Refunds can only be processed for completed payments.');
            }

            return $payment['id'];
        } catch (\Exception $e) {
            \Log::error("Error retrieving payment ID for reference number {$referenceNumber}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Trace payment_id using reference_number.
     *
     * @param string $referenceNumber
     * @return string
     * @throws \Exception
     */

    /**
     * Log detailed refund information for traceability.
     *
     * @param array $refundData
     * @param string $bookingId
     * @param float $amount
     * @return void
     */
    private function logRefundDetails(array $refundData, string $bookingId, float $amount, $moderatedBy = null)
    {
        \Log::info("Refund initiated successfully", [
            'booking_id' => $bookingId,
            'amount' => $amount,
            'refund_id' => $refundData['id'],
            'processed_by' => auth()->id(),
            'moderated_by' => $moderatedBy,

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

