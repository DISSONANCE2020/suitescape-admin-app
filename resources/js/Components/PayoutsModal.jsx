import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";

const PayoutsModal = ({ onClose, bookingId }) => {
    const { payoutMethods } = usePage().props;
    const [selectedMethod, setSelectedMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTransfer = async () => {
        if (
            !selectedMethod ||
            !isValidUUID(selectedMethod) ||
            !amount ||
            amount <= 0
        ) {
            alert("Please select a payout method and enter a valid amount.");
            return;
        }

        setLoading(true);

        router.post(
            `/finance-manager/payout-methods/${selectedMethod}/transfer`,
            {
                amount,
                description: "Refund Transfer",
                booking_id: bookingId,
            },
            {
                onSuccess: () => {
                    alert("Transfer initiated successfully!");
                    onClose();
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
                            Refund will be processed for booking ID:{" "}
                            {bookingId}...
                        </p>
                    </div>
                )}

                <select
                    className="w-full p-2 mb-4 border"
                    className="w-full p-2 mb-4 border"
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                >
                    <option value="">Select Payout Method</option>
                    {payoutMethods?.map((method) => {
                        const { id, payoutable_type_key, payoutable } = method;

                        if (payoutable_type_key === "gcash") {
                            return (
                                <option key={id} value={id}>
                                    {`GCash - ${
                                        payoutable?.phone_number || "N/A"
                                    }`}
                                </option>
                            );
                        } else if (payoutable_type_key === "bank") {
                            return (
                                <option key={id} value={id}>
                                    {`Bank - ${
                                        payoutable?.account_number || "N/A"
                                    } (${
                                        payoutable?.bank_name ||
                                        payoutable?.bank_code ||
                                        "N/A"
                                    })`}
                                </option>
                            );
                        } else {
                            return (
                                <option key={id} value={id}>
                                    Unknown Payment Method
                                </option>
                            );
                        }
                    })}
                </select>

                <div className="relative mb-4">
                    <input
                        type="number"
                        placeholder="Amount in PHP"
                        className="w-full p-2 mb-4 border"
                        className="w-full p-2 mb-4 border"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
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
                        className="px-4 py-2 text-white bg-blue-500 rounded disabled:bg-blue-300"
                        disabled={!selectedMethod || !amount || loading}
                    >
                        {loading ? "Processing..." : "Process Refund"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayoutsModal;
