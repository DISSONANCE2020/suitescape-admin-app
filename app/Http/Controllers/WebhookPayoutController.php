<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\PayoutMethod;

class WebhookPayoutController extends Controller
{
    public function handlePayout(Request $request)
    {
        Log::info('Webhook received');

        $payload = $request->getContent();
        Log::info('Raw webhook payload', ['payload' => $payload]);

        $data = json_decode($payload, true);
        if (!$data) {
            Log::error('Invalid or empty webhook payload');
            return response()->json(['error' => 'Invalid payload'], 400);
        }

        Log::info('Decoded webhook data', ['data' => $data]);

        $signature = $request->header('Paymongo-Signature');
        Log::info('Webhook signature', ['signature' => $signature]);

        $paymongo_secret_key = env('PAYMONGO_WEBHOOK_SECRET');
        if (!$this->isValidSignature($signature, $payload, $paymongo_secret_key)) {
            Log::warning('Invalid PayMongo webhook signature.');
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        $event = $data['data']['attributes']['type'] ?? null;
        Log::info('Webhook event type', ['event' => $event]);

        $paymentData = $data['data']['attributes']['data']['attributes'] ?? [];
        Log::info('Payment data', ['payment_data' => $paymentData]);

        $metadata = $paymentData['metadata'] ?? [];
        Log::info('Webhook metadata', ['metadata' => $metadata]);

        $status = $paymentData['status'] ?? null;
        Log::info('Payment status', ['status' => $status]);

        $userId = $metadata['user_id'] ?? null;
        Log::info('User ID from metadata', ['user_id' => $userId]);

        if (!$userId) {
            $description = $paymentData['description'] ?? '';
            Log::info('Payment description', ['description' => $description]);

            if (preg_match('/User ID: ([a-zA-Z0-9\-]+)/', $description, $matches)) {
                $userId = $matches[1];
                Log::info('Extracted User ID from description', ['user_id' => $userId]);
            }
        }

        switch ($event) {
            case 'payment.paid':
                if ($userId && $status === 'paid') {
                    $this->updatePayoutMethodStatus($userId, 'paid');
                    Log::info('Payment succeeded and payout method updated for user', ['user_id' => $userId]);
                }
                break;

            case 'payment.failed':
                if ($userId) {
                    $this->updatePayoutMethodStatus($userId, 'failed');
                    Log::info('Payment failed for user', ['user_id' => $userId]);
                }
                break;

            default:
                Log::info('Unhandled PayMongo webhook event', ['event' => $event]);
                break;
        }

        return response()->json(['message' => 'Webhook processed successfully'], 200);
    }

    private function updatePayoutMethodStatus(string $userId, string $status)
    {
        try {
            Log::info('Updating payout method status', ['user_id' => $userId]);

            // Query the payout_methods table using user_id
            $payoutMethod = PayoutMethod::where('user_id', $userId)->first();

            if ($payoutMethod) {
                $payoutMethod->transfer_status = $status;
                $payoutMethod->save();

                Log::info("Payout method status updated successfully", [
                    'payout_method_id' => $payoutMethod->id,
                    'user_id' => $userId,
                    'new_status' => $status
                ]);
            } else {
                Log::warning("No payout method found for user_id", ['user_id' => $userId]);
            }
        } catch (\Exception $e) {
            Log::error("Failed to update payout method status", [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    private function isValidSignature($signature, $payload, $webhook_secret_key)
    {
        if (empty($signature) || empty($webhook_secret_key)) {
            Log::warning('Missing signature or webhook secret key');
            return false;
        }

        $parts = explode(',', $signature);
        $timestamp = null;
        $signatureHash = null;

        foreach ($parts as $part) {
            if (strpos($part, 't=') === 0) {
                $timestamp = substr($part, 2);
            } elseif (strpos($part, 'te=') === 0) {
                $signatureHash = substr($part, 3);
            }
        }

        if (!$timestamp || !$signatureHash) {
            Log::warning('Invalid signature format', ['signature' => $signature]);
            return false;
        }

        $computedSignature = hash_hmac('sha256', $timestamp . '.' . $payload, $webhook_secret_key);
        $isValid = hash_equals($computedSignature, $signatureHash);

        Log::info('Signature validation result', ['is_valid' => $isValid]);

        return $isValid;
    }
}
