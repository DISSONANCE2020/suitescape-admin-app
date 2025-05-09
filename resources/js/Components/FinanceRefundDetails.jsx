import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import RefundsModal from "./RefundsModal";

const FinanceRefundDetails = ({
    booking,
    users,
    listings,
    payoutMethods,
    onClose,
}) => {
    const [showRefundsModal, setShowRefundsModal] = useState(false);
    const { props } = usePage();

    if (!booking) return null;

    const listing = listings?.find((l) => l.id === booking?.listing_id);
    const host = users?.find((u) => u.id === listing?.user_id);
    const guest = users?.find((u) => u.id === booking?.user_id);

    const paymentMethod = booking.invoice.payment_method
        ? booking.invoice.payment_method === "gcash"
            ? "GCash"
            : booking.invoice.payment_method === "bank_transfer"
            ? "Bank Transfer"
            : booking.invoice.payment_method === "credit_card"
            ? "Credit Card"
            : "N/A"
        : "N/A";

    const refundStatus = booking.invoice
        ? booking.invoice.payment_status === "paid"
            ? "REFUND PENDING"
            : booking.invoice.payment_status === "fully_refunded"
            ? "FULLY REFUNDED"
            : booking.invoice.payment_status === "partially_refunded"
            ? "PARTIALLY REFUNDED"
            : "N/A"
        : "N/A";

    const handleProcessRefund = () => {
        setShowRefundsModal(true);
    };

    const handleRefundComplete = () => {
        setShowRefundsModal(false);
        Inertia.reload();
    };

    const isRefundProcessable = refundStatus === "REFUND PENDING";

    const hostPayoutMethods =
        host && payoutMethods
            ? payoutMethods.filter(
                  (method) => method.user_id === host.id && method.payoutable
              )
            : [];

    return (
        <div>
            <div className="flex justify-between h-[60px] items-center mb-4 border-b border-[#D1D5DB] pb-4">
                <h2 className="text-lg font-semibold">Refunds</h2>
            </div>
            <br />
            <h2 className="pb-4 text-2xl font-bold capitalize">
                {listing?.name || "Unknown"}{" "}
            </h2>
            <p className="font-bold text-xl text-gray-500 capitalize font-poppins">
                {listing?.facility_type || "N/A"}
            </p>
            <br />
            <div>
                <div>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="pb-4 font-semibold">
                                    Refund Status:
                                </td>
                                <td className="pb-4">
                                    <span
                                        className={`px-3 py-1 text-white font-bold rounded-md ${
                                            refundStatus === "REFUND PENDING"
                                                ? "bg-[#EF4444]"
                                                : refundStatus ===
                                                  "FULLY REFUNDED"
                                                ? "bg-[#10B981]"
                                                : refundStatus ===
                                                  "PARTIALLY REFUNDED"
                                                ? "bg-yellow-500"
                                                : "bg-[#D1D5DB]"
                                        }`}
                                    >
                                        {refundStatus}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 font-semibold">
                                    Booking Reference No:
                                </td>
                                <td className="pb-4">{booking?.id || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="pb-4 font-semibold">
                                    Guest Name:
                                </td>
                                <td className="pb-4capitalize">
                                    {guest
                                        ? `${guest.firstname} ${guest.lastname}`
                                        : "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 font-semibold">
                                    Booking Date:
                                </td>
                                <td className="pb-4 capitalize">
                                    {booking.date_start && booking.date_end
                                        ? `${new Intl.DateTimeFormat("en-US", {
                                              month: "short",
                                              day: "2-digit",
                                          }).format(
                                              new Date(booking.date_start)
                                          )} - ${new Intl.DateTimeFormat(
                                              "en-US",
                                              {
                                                  month: "short",
                                                  day: "2-digit",
                                              }
                                          ).format(
                                              new Date(booking.date_end)
                                          )}, ${new Date(
                                              booking.date_end
                                          ).getFullYear()}`
                                        : "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 font-semibold">
                                    Mode of Payment:
                                </td>
                                <td className="pb-4 capitalize">
                                    {paymentMethod}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 font-semibold">
                                    Refund Amount:
                                </td>
                                <td className="pb-4 capitalize">
                                    ₱{booking?.amount || "N/A"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex gap-4 mt-6 justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-3 text-sm font-medium text-black bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 drop-shadow-sm"
                >
                    Close
                </button>
                {host && (
                    <button
                        onClick={handleProcessRefund}
                        disabled={!isRefundProcessable}
                        className={`px-4 py-3 text-sm rounded-md ${
                            isRefundProcessable
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Process Refund
                    </button>
                )}
            </div>

            {showRefundsModal && host && (
                <RefundsModal
                    amount={booking.amount}
                    payoutMethods={hostPayoutMethods}
                    bookingId={booking.id}
                    onClose={() => setShowRefundsModal(false)}
                    onRefundComplete={handleRefundComplete}
                />
            )}
        </div>
    );
};

export default FinanceRefundDetails;
