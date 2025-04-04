import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";

const PayoutsModal = ({ onClose }) => {
    const { payoutMethods } = usePage().props;
    const [selectedMethod, setSelectedMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const { csrf_token } = usePage().props;

    const handleTransfer = async () => {
        if (!selectedMethod || !isValidUUID(selectedMethod) || !amount || amount <= 0) {
            alert("Please select a payout method and enter a valid amount.");
            return;
        }

        setLoading(true);
        
        router.post(`/finance-manager/payout-methods/${selectedMethod}/transfer`, {
            amount: amount,
            description: "Transfer"
        }, {
            onSuccess: () => {
                alert("Transfer initiated successfully!");
                onClose();
                setLoading(false);
            },
            onError: (errors) => {
                alert(Object.values(errors).join('\n'));
                setLoading(false);
            }
        });
    };

    const isValidUUID = (uuid) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
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
                    {payoutMethods &&
                        payoutMethods.map((method) => {
                            if (method.payoutable_type_key === "gcash") {
                                return (
                                    <option key={method.id} value={method.id}>
                                        {`GCash - ${
                                            method.payoutable &&
                                            method.payoutable.phone_number
                                                ? method.payoutable.phone_number
                                                : "N/A"
                                        }`}
                                    </option>
                                );
                            } else if (method.payoutable_type_key === "bank") {
                                const bankAccount = method.payoutable;
                                return (
                                    <option key={method.id} value={method.id}>
                                        {`Bank - ${
                                            bankAccount &&
                                            bankAccount.account_number
                                                ? bankAccount.account_number
                                                : "N/A"
                                        } (${
                                            bankAccount && bankAccount.bank_name
                                                ? bankAccount.bank_name
                                                : bankAccount &&
                                                  bankAccount.bank_code
                                                ? bankAccount.bank_code
                                                : "N/A"
                                        })`}
                                    </option>
                                );
                            } else {
                                return (
                                    <option key={method.id} value={method.id}>
                                        {`Unknown Payment Method`}
                                    </option>
                                );
                            }
                        })}
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
                        value={csrf_token}
                    >
                        {loading ? "Processing..." : "Transfer"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayoutsModal;
