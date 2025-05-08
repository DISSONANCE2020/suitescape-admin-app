<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Invoice;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        // Verify the webhook signature
        $signature = $request->header('Paymongo-Signature');
        $payload = $request->getContent();
        $secret = env('PAYMONGO_WEBHOOK_SECRET'); // Use environment variable

        if (!$this->isValidSignature($signature, $payload, $secret)) {
            Log::warning('Invalid PayMongo webhook signature.');
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Process the webhook event
        $data = json_decode($payload, true);
        $event = $data['data']['attributes']['type'] ?? null;

        // Get the payment details
        $paymentData = $data['data']['attributes'] ?? [];
        $metadata = $paymentData['metadata'] ?? [];
        $bookingId = $metadata['booking_id'] ?? null;

        Log::info('PayMongo webhook received', [
            'event' => $event,
            'booking_id' => $bookingId,
            'payment_id' => $data['data']['id'] ?? 'unknown'
        ]);

        switch ($event) {
            case 'payment.refunded':
                // Handle payment refunded event
                if ($bookingId) {
                    $this->updateInvoiceStatus($bookingId, 'refunded');
                    Log::info('Payment refunded and invoice updated for booking', ['booking_id' => $bookingId]);
                }
                break;

            // case 'payment.failed':
            //     // Handle payment failed event
            //     if ($bookingId) {
            //         $this->updateInvoiceStatus($bookingId, 'failed');
            //         Log::info('Payment failed for booking', ['booking_id' => $bookingId]);
            //     }
            //     break;

            // case 'payment.paid':
            //     // Handle payment paid event
            //     if ($bookingId) {
            //         $this->updateInvoiceStatus($bookingId, 'refunded');
            //         Log::info('Payment succeeded and invoice updated for booking', ['booking_id' => $bookingId]);
            //     }
            //     break;

            default:
                Log::info('Unhandled PayMongo webhook event', ['event' => $event]);
        }

        return response()->json(['message' => 'Webhook processed successfully'], 200);
    }

    /**
     * Update the invoice status for a booking
     *
     * @param string $bookingId The booking ID
     * @param string $status The new status ('refunded', 'failed', etc.)
     * @return void
     */
    private function updateInvoiceStatus(string $bookingId, string $status)
    {
        try {
            // Find the invoice related to the booking
            $invoice = Invoice::where('booking_id', $bookingId)->first();

            if ($invoice) {
                $invoice->payment_status = $status;
                $invoice->save();

                Log::info("Invoice status updated successfully", [
                    'invoice_id' => $invoice->id,
                    'booking_id' => $bookingId,
                    'new_status' => $status
                ]);

            } else {
                Log::warning("No invoice found for booking", ['booking_id' => $bookingId]);
            }
        } catch (\Exception $e) {
            Log::error("Failed to update invoice status", [
                'booking_id' => $bookingId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Validate the webhook signature
     *
     * @param string $signature The signature from the request header
     * @param string $payload The raw request body
     * @param string $secret The webhook secret key
     * @return bool
     */
    private function isValidSignature($signature, $payload, $secret)
    {
        if (empty($signature) || empty($secret)) {
            return false;
        }

        // Implement your signature verification logic here
        // For example, using HMAC SHA256
        $computedSignature = hash_hmac('sha256', $payload, $secret);

        return hash_equals($signature, $computedSignature);
    }
}