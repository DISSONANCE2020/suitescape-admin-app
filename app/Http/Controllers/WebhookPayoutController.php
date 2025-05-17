<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\PayoutMethod;

class WebhookPayoutController extends Controller
{
    public function handlePayout(Request $request)
    {
        $payload = $request->getContent();
        log::info('Received PayMongo webhook', [
            'payload' => $payload,
        ]);
        $signatureHeader = $request->header('Paymongo-Signature');
        log::info('PayMongo-Signature header', [
            'signature_header' => $signatureHeader,
        ]);
        $paymongoSecretKey = env('PAYMONGO_WEBHOOK_SECRET');


        if (!$this->isValidSignature($signatureHeader, $payload, $paymongoSecretKey)) {
            Log::warning('Invalid PayMongo webhook signature.');
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Parse webhook payload
        $data = json_decode($payload, true);
        $event = $data['data']['attributes']['type'] ?? null;
        $paymentResource = $data['data']['attributes']['data'] ?? null;
        $paymentAttributes = $paymentResource['attributes'] ?? [];

        $metadata = $paymentAttributes['metadata'] ?? [];
        $description = $paymentAttributes['description'] ?? '';

        $bookingId = $metadata['booking_id'] ?? null;
        if (!$bookingId && $description) {
            preg_match('/Booking ID:\s*([a-zA-Z0-9\-]+)/', $description, $matches);
            $bookingId = $matches[1] ?? null;
        }

        Log::info('PayMongo webhook received', [
            'event' => $event,
            'booking_id' => $bookingId,
            'payment_id' => $data['data']['id'] ?? 'unknown'
        ]);

        if ($event === 'payment.paid' && $bookingId) {
            $this->updatePayoutStatus($bookingId, 'paid');
        }

        return response()->json(['success' => true]);
    }

    /**
     * Update the payout method transfer_status
     */
    private function updatePayoutStatus(string $bookingId, string $status)
    {
        try {
            $payoutMethod = PayoutMethod::where('booking_id', $bookingId)->first();
            if ($payoutMethod) {
                $payoutMethod->transfer_status = $status;
                $payoutMethod->save();
                Log::info('PayoutMethod transfer_status updated', [
                    'payout_method_id' => $payoutMethod->id,
                    'new_status' => $status
                ]);
            } else {
                Log::warning('PayoutMethod not found', ['booking_id' => $bookingId]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to update payout status', [
                'booking_id' => $bookingId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Validate the webhook signature
     */
    private function isValidSignature($signatureHeader, $payload, $secret)
    {
        if (empty($signatureHeader) || empty($secret)) {
            return false;
        }
        $signatureParts = explode(',', $signatureHeader);
        $signatures = [];
        foreach ($signatureParts as $part) {
            [$key, $value] = array_map('trim', explode('=', $part));
            $signatures[$key] = $value;
        }
        $timestamp = $signatures['t'] ?? null;
        $paymongoSignature = $signatures['te'] ?? null;
        if (!$timestamp || !$paymongoSignature) {
            return false;
        }
        $signedPayload = "{$timestamp}.{$payload}";
        $computedSignature = hash_hmac('sha256', $signedPayload, $secret);
        return hash_equals($paymongoSignature, $computedSignature);
    }

}
