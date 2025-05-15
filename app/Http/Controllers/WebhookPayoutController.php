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

        // Combine timestamp and raw body
        $signedPayload = "{$timestamp}.{$payload}";
        $computedSignature = hash_hmac('sha256', $signedPayload, $paymongoSecretKey);

        // Log signature verification info
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
        // Log webhook receipt
        Log::info('PayMongo webhook received', [
            'event' => $event,
            'booking_id' => $bookingId,
            'payment_id' => $data['data']['id'] ?? 'unknown'
        ]);
    }

}
