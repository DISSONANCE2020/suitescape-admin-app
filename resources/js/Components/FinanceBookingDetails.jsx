import React from "react";

const FinanceBookingDetails = ({ booking, onClose }) => {
    if (!booking) return null;

    console.log("Booking Data:", booking?.listing);

    const amountPaid = parseFloat(booking.amount) || 0;
    const commission = amountPaid * 0.02; // 2% commission
    const hostPayout = amountPaid - commission; // Host's final earnings

    return (
        <div className="">
            <div className="text-4xl font-semibold mb-5 capitalize">
                {booking.listing?.facility_type}
            </div>
            <div className="text-2xl text-gray-800 mb-4 font-regular">
                {booking?.listing ? `${booking.listing.name}` : "Unknown"}
            </div>
            <div className="border mb-5 border-gray-200"></div>

            <div className="mb-4">
                <strong className="">Status:</strong> PAYMENT PENDING
            </div>
            <div className="mb-4">
                <strong className="">Booking ID:</strong>{" "}
                {booking.id ? booking.id : "No ID Available"}
            </div>
            <div className="mb-4">
                <strong className="">Customer Name: </strong>{" "}
                {booking.user?.firstname} {booking.user?.lastname}
            </div>

            <div className="mb-4">
                <strong className="">Check-In:</strong>{" "}
                {new Date(booking.date_start).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                })}{" "}
                -{" "}
                {new Date(booking.date_end).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                })}
            </div>

            <div className="flex mb-4">
                <strong className="">Mode of Payment:</strong>
                <span className="w-48 text-right">
                    {booking.payoutMethodDetail?.type || "N/A"}
                </span>
            </div>

            <div className="flex mb-4">
                <strong className="">Amount Paid:</strong>
                <span className="w-64 text-right">
                    ₱{amountPaid.toFixed(2)}
                </span>
            </div>

            <div className="mb-4">
                <strong className="">Suitescape Commission (2%):</strong> ₱
                {commission.toFixed(2)}
            </div>

            <div className="mb-4">
                <strong className="">Host Payout:</strong> ₱
                {hostPayout.toFixed(2)}
            </div>

            <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
                Close
            </button>
        </div>
    );
};

export default FinanceBookingDetails;
