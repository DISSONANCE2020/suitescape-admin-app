<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * Mark an invoice as refunded.
     *
     * This method is intended to be triggered (for example, from the FinanceRefundTable via PayoutModal)
     * when a refund payment has been issued.
     *
     * @param  Request  $request
     * @param  string  $invoiceId
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsRefunded(Request $request, $invoiceId)
    {
        // Find the invoice or fail with a 404 error.
        $invoice = Invoice::findOrFail($invoiceId);

        // Update the payment_status to 'refunded'
        $invoice->payment_status = 'refunded';
        $invoice->save();

        return response()->json([
            'message' => 'Invoice marked as refunded successfully.',
            'invoice' => $invoice
        ]);
    }
}
