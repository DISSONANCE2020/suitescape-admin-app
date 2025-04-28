import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";

const PayoutsModal = ({ onClose, amount, bookingId, onRefundComplete }) => {
    const { payoutMethods } = usePage().props;
    const [loading, setLoading] = useState(false);

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

    const isValidUUID = (uuid) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            uuid
        );
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Process Refund</h2>

                {bookingId && (
                    <div className="mb-4 p-2 bg-blue-50 border border-blue-100 rounded">
                        <p className="text-sm text-blue-700">
                            Refund will be processed for booking ID: {bookingId}
                        </p>
                    </div>
                )}

                <div className="mb-4 p-2 bg-gray-50 border border-gray-100 rounded">
                    <p className="text-sm">
                        <strong>Amount to Refund:</strong> PHP ₱
                        {amount || "N/A"}
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
                        {loading ? "Processing..." : "Process Refund"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayoutsModal;
