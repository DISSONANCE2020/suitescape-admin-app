import React, { useState } from "react";
import { usePage } from "@inertiajs/react";

const PayoutsModal = ({ onClose }) => {
    const { payoutMethods } = usePage().props;

    const [selectedMethod, setSelectedMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTransfer = async () => {
        if (!selectedMethod || !amount || amount <= 0) {
            alert("Please select a payout method and enter a valid amount.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `/payout-methods/${selectedMethod}/transfer`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount, description: "Transfer" }),
                }
            );

            if (!response.ok) throw new Error("Transfer failed");
            alert("Transfer initiated successfully!");
            onClose();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Transfer Funds</h2>

                <select
                    className="w-full p-2 border mb-4"
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                >
                    <option value="">Select Payout Method</option>
                    {payoutMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                            {method.payoutable_type.includes("Gcash")
                                ? `GCash - ${
                                      method.payoutable?.phone_number || "N/A"
                                  }`
                                : `Bank - ${
                                      method.payoutable?.account_number || "N/A"
                                  } (${method.payoutable?.bank_code || "N/A"})`}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Amount in PHP"
                    className="w-full p-2 border mb-4"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleTransfer}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                        disabled={!selectedMethod || !amount || loading}
                    >
                        {loading ? "Processing..." : "Transfer"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayoutsModal;
