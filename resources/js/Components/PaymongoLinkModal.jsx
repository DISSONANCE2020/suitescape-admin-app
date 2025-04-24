import React from "react";

const PaymongoLinkModal = ({ link, onClose }) => {
    if (!link) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="mb-4 text-2xl font-semibold">Payout Link</h2>

                <div className="w-full h-[600px]">
                    <iframe
                        src={link}
                        title="PayMongo Payment"
                        width="100%"
                        height="100%"
                        className="border rounded-lg"
                        allow="payment"
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymongoLinkModal;
