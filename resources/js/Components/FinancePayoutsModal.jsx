import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";

const FinancePayoutsModal = ({ onClose, userId }) => {
    const { payoutMethods } = usePage().props;
    const [selectedMethod, setSelectedMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    console.log("Payout Methods: ", payoutMethods);

    // Filter payoutMethods by user_id
    const userPayoutMethods = payoutMethods?.filter(
        (method) => method.user_id === userId
    );

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
                description: "Transfer",
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
            <div className="p-6 bg-white rounded-lg shadow-lg w-96">
                <h2 className="mb-4 text-xl font-semibold">Transfer Funds</h2>

                <select
                    className="w-full p-2 mb-4 border"
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                >
                    <option value="">Select Payout Method</option>
                    {userPayoutMethods?.map((method) => {
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
                        disabled={!selectedMethod || !amount || loading}
                    >
                        {loading ? "Processing..." : "Transfer"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinancePayoutsModal;
