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
        $payload = $request->getContent();
        $signatureHeader = $request->header('Paymongo-Signature');

        // Parse the header
        $signatureParts = explode(',', $signatureHeader);
        $signatures = [];
        foreach ($signatureParts as $part) {
            [$key, $value] = array_map('trim', explode('=', $part));
            $signatures[$key] = $value;
        }

        $timestamp = $signatures['t'] ?? null;
        $paymongoSignature = $signatures['te'] ?? null;

        $paymongoSecretKey = env('PAYMONGO_WEBHOOK_SECRET');

        // IMPORTANT: Combine timestamp and raw body
        $signedPayload = "{$timestamp}.{$payload}";
        $computedSignature = hash_hmac('sha256', $signedPayload, $paymongoSecretKey);

        // Debug log
        Log::debug('Webhook Signature Check', [
            'signature_header' => $signatureHeader,
            'timestamp' => $timestamp,
            'parsed_signature_te' => $paymongoSignature,
            'signed_payload' => $signedPayload,
            'computed_signature' => $computedSignature,
            'payload' => $payload,
            'using_secret' => $paymongoSecretKey
        ]);

        if (
            empty($paymongoSignature) ||
            empty($paymongoSecretKey) ||
            !hash_equals($paymongoSignature, $computedSignature)
        ) {
            Log::warning('Invalid PayMongo webhook signature.');
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Proceed with parsing and handling webhook
        $data = json_decode($payload, true);
        $event = $data['data']['attributes']['type'] ?? null;

        $paymentData = $data['data']['attributes'] ?? [];
        $metadata = $paymentData['metadata'] ?? [];
        $bookingId = $metadata['booking_id'] ?? null;

        Log::info('PayMongo webhook received', [
            'event' => $event,
            'booking_id' => $bookingId,
            'payment_id' => $data['data']['id'] ?? 'unknown'
        ]);

        switch ($event) {
            case 'payment.paid':
                if ($bookingId) {
                    $this->updatePayoutMethodStatus($bookingId, 'sent');
                }
                break;

            case 'payment.failed':
                if ($bookingId) {
                    $this->updatePayoutMethodStatus($bookingId, 'failed');
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
