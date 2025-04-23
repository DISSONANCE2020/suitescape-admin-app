import React, { useState } from "react";
import FinanceListingDetailsModal from "./FinanceListingDetailsModal";
import FinancePayoutsModal from "./financePayoutsModal";

const FinancePayoutDetails = ({
    booking,
    users,
    invoices,
    listings,
    payoutMethods,
    onClose,
}) => {
    if (!booking) return null;

    // Find the payout method associated with the booking

    // Find the listing associated with the booking
    const listing = listings?.find((l) => l.id === booking?.listing_id);
    // Find the host associated with the listing
    const host = users?.find((u) => u.id === listing?.user_id);
    // Find the guest associated with the booking
    const guest = users?.find((u) => u.id === booking?.user_id);
    // Find the invoices associated with the booking
    const invoice = invoices?.find((i) => i.booking_id === booking?.id);
    const payoutMethod = payoutMethods?.find((p) => p.user_id === host?.id);

    const amountPaid = parseFloat(booking.amount) || 0;

    // Set the initial SuiteEscape fee percentage (default 3%)
    const [suiteEscapeFeePercentage, setSuiteEscapeFeePercentage] = useState(3);

    // Calculate the SuiteEscape fee and payout amount
    const suitescapeFee = amountPaid * (suiteEscapeFeePercentage / 100);
    const payoutAmount = amountPaid - suitescapeFee;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPayoutsModal, setShowPayoutsModal] = useState(false);

    // Filter payout methods for the host
    const hostPayoutMethods =
        host && payoutMethods
            ? payoutMethods.filter(
                  (method) => method.user_id === host.id && method.payoutable
              )
            : [];

    const handleListingClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Handle fee percentage change
    const handleFeePercentageChange = (e) => {
        setSuiteEscapeFeePercentage(parseFloat(e.target.value));
    };

    return (
        <div>
            {/* Header Section */}
            <h2 className="pb-2 m-2 text-4xl font-semibold capitalize">
                {listing?.facility_type || "N/A"}
            </h2>
            <p className="m-2 text-2xl capitalize font-poppins">
                {listing?.name || "Unknown"}
            </p>
            <div className="mt-6 mb-6 border border-gray-300"></div>

            {/* Two-Column Layout */}
            <div className="grid grid-flow-col grid-cols-2">
                {/* Left Column - Payout Details */}
                <div>
                    <h3 className="mb-6 ml-2 text-2xl font-semibold text-gray-500">
                        Payout Details
                    </h3>

                    <table className="w-full">
                        <tbody>
                            {/* Listing ID */}
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Listing ID:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    <button
                                        onClick={handleListingClick}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {listing?.id}
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Host Email:
                                </td>
                                <td className="pb-4 text-xl">
                                    {host?.email || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-12 pl-4 text-xl font-semibold">
                                    Payout Status:
                                </td>
                                <td className="pb-12 text-xl capitalize">
                                    {payoutMethod?.transfer_status || "N/A"}
                                </td>
                            </tr>
                            {/* Fee Percentage Input */}
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    SuiteEscape Fee (%):
                                </td>
                                <td className="pb-4 text-xl">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={suiteEscapeFeePercentage}
                                        onChange={handleFeePercentageChange}
                                        className="w-20 p-2 border border-gray-300 rounded-md"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Booking Amount:
                                </td>
                                <td className="pb-4 text-xl">
                                    ₱ {booking?.amount || "N/A"}
                                </td>
                            </tr>

                            {/* Dynamic SuiteEscape Fee */}
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    SuiteEscape Fee ({suiteEscapeFeePercentage}
                                    %):
                                </td>
                                <td className="pb-4 text-xl">
                                    ₱ {suitescapeFee.toFixed(2) || "N/A"}
                                </td>
                            </tr>

                            <tr>
                                <td className="pb-4 pl-4 text-xl font-bold">
                                    Payout Amount:
                                </td>
                                <td className="pb-4 text-xl font-bold">
                                    ₱ {payoutAmount.toFixed(2) || "N/A"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Right Column - Booking Details */}
                <div>
                    <h3 className="mb-6 ml-2 text-2xl font-semibold text-gray-500">
                        Booking Details
                    </h3>

                    <table className="w-full">
                        <tbody>
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
                                    Booking No:
                                </td>
                                <td className="pb-4 text-xl">
                                    {booking?.id || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Mode of Payment:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    {invoice?.payment_method || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Paid on:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    {booking.created_at
                                        ? new Intl.DateTimeFormat("en-US", {
                                              year: "numeric",
                                              month: "short",
                                              day: "2-digit",
                                          }).format(
                                              new Date(booking.created_at)
                                          )
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
                                    Booking Status:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    {booking.status || "N/A"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Button Section */}
            <div className="flex gap-4 p-3 mt-4">
                <button
                    onClick={onClose}
                    className="px-6 py-3 font-medium text-black bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 "
                >
                    Close
                </button>
                {host && (
                    <button
                        onClick={() => setShowPayoutsModal(true)}
                        className="px-6 py-3 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        Send Payout
                    </button>
                )}
            </div>

            {isModalOpen && (
                <FinanceListingDetailsModal
                    listing={listing}
                    users={users}
                    onClose={handleCloseModal}
                />
            )}

            {showPayoutsModal && host && (
                <FinancePayoutsModal
                    payoutMethods={hostPayoutMethods}
                    onClose={() => setShowPayoutsModal(false)}
                    amount={amountPaid} // You might want to pass the amount to transfer
                    payoutAmount={payoutAmount}
                    suiteEscapeFee={suitescapeFee}
                    suiteEscapeFeePercentage={suiteEscapeFeePercentage}
                    users={users}
                    listing={listing}
                    booking={booking}
                    bookingId={booking.id} // And other relevant data
                />
            )}
        </div>
    );
};

export default FinancePayoutDetails;
