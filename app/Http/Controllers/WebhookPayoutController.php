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
        $data = json_decode($payload, true);

        Log::info('PayMongo Webhook received:', $data);

        $eventType = $data['data']['attributes']['event_type'] ?? null;
        $paymentId = $data['data']['attributes']['data']['id'] ?? null;

        if ($eventType && $paymentId) {
            $payment = PayoutMethod::where('paymongo_id', $paymentId)->first();

            if ($payment) {
                if ($eventType === 'payment.paid') {
                    $payment->status = 'paid';
                } elseif ($eventType === 'payment.failed') {
                    $payment->status = 'failed';
                }

                $payment->save();
                Log::info("Payment {$paymentId} status updated to {$payment->status}");
            } else {
                Log::warning("Payment with PayMongo ID {$paymentId} not found.");
            }
        }

        return response()->json(['received' => true], 200);
    }

    private function updatePayoutMethodStatus(string $bookingId, string $status)
    {
        try {
            $payoutMethod = PayoutMethod::where('booking_id', $bookingId)->first();

            if ($payoutMethod) {
                if ($payoutMethod->status !== 'paid' && $payoutMethod->status !== 'failed') {
                    $payoutMethod->status = $status;
                    $payoutMethod->save();

                    Log::info("Payout method status updated", [
                        'payout_method_id' => $payoutMethod->id,
                        'booking_id' => $bookingId,
                        'new_status' => $status
                    ]);
                } else {
                    Log::info("Payout method already updated", [
                        'payout_method_id' => $payoutMethod->id,
                        'booking_id' => $bookingId,
                        'current_status' => $payoutMethod->status
                    ]);
                }
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

    private function isValidSignature($signature, $payload, $secret)
    {
        if (empty($signature) || empty($secret)) {
            return false;
        }

        $computedSignature = hash_hmac('sha256', $payload, $secret);
        return hash_equals($signature, $computedSignature);
    }
}
