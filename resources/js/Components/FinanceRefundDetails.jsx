import React, { useState } from "react";
import PayoutsModal from "./PayoutsModal";

const FinanceRefundDetails = ({
    booking,
    users,
    listings,
    payoutMethods,
    onClose,
}) => {
    const [showPayoutsModal, setShowPayoutsModal] = useState(false);

    if (!booking) return null;

    const listing = listings?.find((l) => l.id === booking?.listing_id);
    const host = users?.find((u) => u.id === listing?.user_id);
    const guest = users?.find((u) => u.id === booking?.user_id);

    const refundStatus = booking.invoice
        ? booking.invoice.payment_status === "paid"
            ? "Refund Pending"
            : booking.invoice.payment_status === "refunded"
            ? "Refund Issued"
            : "N/A"
        : "N/A";

    const handleProcessRefund = () => {
        setShowPayoutsModal(true);
    };

    const isRefundProcessable = refundStatus === "Refund Pending";

    const hostPayoutMethods =
        host && payoutMethods
            ? payoutMethods.filter(
                  (method) => method.user_id === host.id && method.payoutable // Ensure payoutable exists
              )
            : [];

    return (
        <div>
            <h2 className="pb-2 m-2 text-4xl font-semibold capitalize">
                {listing?.facility_type || "N/A"}
            </h2>
            <p className="m-2 text-2xl capitalize font-poppins">
                {listing?.name || "Unknown"}
            </p>
            <div className="mt-6 mb-6 border border-gray-300"></div>
            <div>
                <div>
                    <h3 className="mb-6 ml-2 text-2xl font-semibold text-gray-500 capitalize">
                        Refund Details
                    </h3>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Booking Reference No:
                                </td>
                                <td className="pb-4 text-xl">
                                    {booking?.id || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Guest Name:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    {guest
                                        ? `${guest.firstname} ${guest.lastname}`
                                        : "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Booking Date:
                                </td>
                                <td className="pb-4 text-xl capitalize">
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
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Mode of Payment:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    {guest
                                        ? `${guest.firstname} ${guest.lastname}`
                                        : "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Refund Amount:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    ₱{booking?.amount || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Company Commission:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    ₱{booking?.amount || "N/A"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                <button
                    onClick={onClose}
                    className="px-6 py-3 font-medium text-black bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 drop-shadow-sm"
                >
                    Close
                </button>
                {host && (
                    <button
                        onClick={handleProcessRefund}
                        disabled={!isRefundProcessable}
                        className={`px-4 py-2 rounded-lg ${
                            isRefundProcessable
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Process Refund
                    </button>
                )}
            </div>

            {showPayoutsModal && host && (
                <PayoutsModal
                    payoutMethods={hostPayoutMethods}
                    bookingId={booking.id}
                    onClose={() => setShowPayoutsModal(false)}
                />
            )}
        </div>
    );
};

export default FinanceRefundDetails;
