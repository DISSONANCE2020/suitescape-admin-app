import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";

const RefundsModal = ({
    onClose,
    amount,
    invoice,
    bookingId,
    onRefundComplete,
}) => {
    const { payoutMethods } = usePage().props;
    const [loading, setLoading] = useState(false);

    const partialAmount = amount * 0.8;

    const handleTransfer = async () => {
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setLoading(true);

        router.post(
            `/finance-manager/transfer-funds`,
            {
                amount,
                description: "Refund Transfer",
                booking_id: bookingId,
            },
            {
                onSuccess: () => {
                    alert("Transfer initiated successfully!");
                    onClose();
                    onRefundComplete();
                },
                onError: (errors) => {
                    alert(Object.values(errors).join("\n"));
                },
                onFinish: () => setLoading(false),
            }
        );
    };

    const handlePartialRefund = async () => {
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setLoading(true);

        router.post(
            "/finance-manager/transfer-funds/partial",
            {
                amount: partialAmount,
                description: "Partial Refund Transfer",
                booking_id: bookingId,
            },
            {
                onSuccess: () => {
                    alert("Partial refund initiated successfully!");
                    onClose();
                    onRefundComplete();
                },
                onError: (errors) => {
                    alert(Object.values(errors).join("\n"));
                },
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Process Refund</h2>

                {bookingId && (
                    <div className="mb-4 p-2 bg-blue-50 border border-blue-100 rounded">
                        <p className="text-sm text-blue-700">
                            <strong>Process refund for booking ID:</strong>
                            <br />
                            {bookingId}
                        </p>
                        <br />
                        <p className="text-sm text-blue-700">
                            <strong>Payment Date:</strong>{" "}
                            {invoice?.created_at
                                ? new Intl.DateTimeFormat("en-US", {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                  }).format(new Date(invoice.created_at))
                                : "N/A"}
                        </p>
                    </div>
                )}

                <div className="mb-4 p-2 bg-gray-50 border border-gray-100 rounded">
                    <p className="text-sm">
                        <strong>Full Refund:</strong> PHP ₱
                        {amount ? Number(amount).toFixed(2) : "N/A"}
                    </p>
                    <p className="text-sm">
                        <strong>Partial Refund:</strong> PHP ₱
                        {partialAmount
                            ? Number(partialAmount).toFixed(2)
                            : "N/A"}
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleTransfer}
                        className="px-4 py-2 text-white bg-blue-500 rounded disabled:bg-blue-300"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Full Refund"}
                    </button>
                    <button
                        onClick={handlePartialRefund}
                        className="px-4 py-2 text-white bg-blue-500 rounded disabled:bg-blue-300"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Partial Refund"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RefundsModal;
