<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Models\PayoutMethod;

class WebhookPayoutController extends Controller
{
    /**
     * Handle the PayMongo webhook for payouts.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function handlePayout(Request $request)
    {
        // Get the raw payload from the request
        $payload = $request->getContent();
        Log::info('Raw webhook payload:', ['payload' => $payload]);

        // Retrieve the PayMongo webhook signature from the request header
        $signature = $request->header('Paymongo-Signature');

        // Retrieve the PayMongo webhook secret key from the environment
        $paymongo_secret_key = env('PAYMONGO_WEBHOOK_SECRET');

        // Validate the signature to ensure the request is from PayMongo
        if (!$this->isValidSignature($signature, $payload, $paymongo_secret_key)) {
            Log::warning('Invalid PayMongo webhook signature.');
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Decode the webhook payload
        $data = json_decode($payload, true);
        $event = $data['data']['attributes']['type'] ?? null;

        // Get the payment details from the webhook
        $paymentData = $data['data']['attributes'] ?? [];
        $metadata = $paymentData['metadata'] ?? [];
        $bookingId = $metadata['booking_id'] ?? null;

        Log::info('PayMongo webhook received', [
            'event' => $event,
            'booking_id' => $bookingId,
            'payment_id' => $data['data']['id'] ?? 'unknown'
        ]);

        // Handle different PayMongo events
        switch ($event) {
            case 'payment.paid':
                // Update status to 'sent' for successful payments
                if ($bookingId) {
                    $this->updatePayoutMethodStatus($bookingId, 'sent');
                    Log::info('Payment succeeded and payout method updated for booking', ['booking_id' => $bookingId]);
                }
                break;

            case 'payment.failed':
                // Update status to 'failed' for failed payments
                if ($bookingId) {
                    $this->updatePayoutMethodStatus($bookingId, 'failed');
                    Log::info('Payment failed for booking', ['booking_id' => $bookingId]);
                }
                break;

            default:
                Log::info('Unhandled PayMongo webhook event', ['event' => $event]);
                break;
        }

        return response()->json(['message' => 'Webhook processed successfully'], 200);
    }

    private function updatePayoutMethodStatus(string $bookingId, string $status)
    {
        try {
            // Find the payout method related to the booking
            $payoutMethod = PayoutMethod::whereHas('booking', function ($query) use ($bookingId) {
                $query->where('id', $bookingId);
            })->first();

            if ($payoutMethod) {
                $payoutMethod->transfer_status = $status;
                $payoutMethod->save();

                Log::info("Payout method status updated successfully", [
                    'payout_method_id' => $payoutMethod->id,
                    'booking_id' => $bookingId,
                    'new_status' => $status
                ]);
            } else {
                Log::warning("No payout method found for booking", ['booking_id' => $bookingId]);
            }
        } catch (\Exception $e) {
            Log::error("Failed to update payout method status", [
                'booking_id' => $bookingId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    private function isValidSignature($signature, $payload, $webhook_secret_key)
    {
        if (empty($signature) || empty($webhook_secret_key)) {
            return false;
        }

        // Compute the signature using HMAC with SHA-256
        $computedSignature = hash_hmac('sha256', $payload, $webhook_secret_key);

        // Compare the computed signature with the received signature
        return hash_equals($signature, $computedSignature);
    }
}
