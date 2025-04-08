<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        // Verify the webhook signature
        $signature = $request->header('Paymongo-Signature');
        $payload = $request->getContent();
        $secret = config('sercies.paymongo.webhook_secret');

        if (!$this->isValidSignature($signature, $payload, $secret)) {
            Log::warning('Invalid PayMongo webhook signature.');
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Process the webhook event
        $event = $request->input('data.attributes.type');

        switch ($event) {
            case 'payment.failed':
                // Handle payment failed event
                Log::info('Payment failed event received', $request->all());
                break;

            case 'payment.succeeded':
                // Handle payment succeeded event
                Log::info('Payment succeeded event received', $request->all());
                break;

            default:
                Log::info('Unhandled PayMongo webhook event', $request->all());
        }

        return response()->json(['message' => 'Webhook received'], 200);
    }

    private function isValidSignature($signature, $payload, $secret)
    {
        // Implement your signature verification logic here
        // For example, using HMAC SHA256
        $computedSignature = hash_hmac('sha256', $payload, $secret);

        return hash_equals($signature, $computedSignature);
    }
}