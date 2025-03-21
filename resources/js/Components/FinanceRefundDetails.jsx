import React from "react";

const FinanceRefundDetails = ({ booking, users, listings, onClose }) => {
    if (!booking) return null;

    const listing = listings?.find((l) => l.id === booking?.listing_id);
    const host = users?.find((u) => u.id === listing?.user_id);
    const guest = users?.find((u) => u.id === booking?.user_id);

    return (
        <div >
            <h2 className="text-2xl font-semibold mb-2">Refund Details</h2>

            <div className="mt-6 mb-6 border border-gray-300"></div>

            <p><strong>Listing:</strong> {listing?.name || "N/A"}</p>
            <p><strong>Host:</strong> {host ? `${host.firstname} ${host.lastname}` : "N/A"}</p>
            <p><strong>Guest:</strong> {guest ? `${guest.firstname} ${guest.lastname}` : "N/A"}</p>
            <p><strong>Check-In:</strong> {booking?.check_in || "N/A"}</p>
            <p><strong>Check-Out:</strong> {booking?.check_out || "N/A"}</p>
            <p><strong>Amount:</strong> ₱{booking?.amount || "0.00"}</p>
            <p><strong>Status:</strong> {booking?.status || "N/A"}</p>
            <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                Close
            </button>
        </div>
    );
};

export default FinanceRefundDetails;
