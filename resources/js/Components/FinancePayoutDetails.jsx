import React, { useState } from "react";
import FinanceListingDetailsModal from "./FinanceListingDetailsModal";

const FinancePayoutDetails = ({
    booking,
    users,
    invoices,
    listings,
    onClose,
}) => {
    if (!booking) return null;

    // Find the listing associated with the booking
    const listing = listings?.find((l) => l.id === booking?.listing_id);
    // Find the host associated with the listing
    const host = users?.find((u) => u.id === listing?.user_id);
    // Find the guest associated with the booking
    const guest = users?.find((u) => u.id === booking?.user_id);
    //find the invoices associated with the booking
    const invoice = invoices?.find((i) => i.booking_id === booking?.id);

    const amountPaid = parseFloat(booking.amount) || 0;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleListingClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            {/* Header Section */}
            <h2 className="m-2 pb-2 text-4xl font-semibold capitalize">
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
                                <td className="pb-4 text-xl">
                                    {invoice?.payment_method || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Booking Amount:
                                </td>
                                <td className="pb-4 text-xl">
                                    ₱{booking?.amount || "N/A"}
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
                                          )} -
                                            ${new Intl.DateTimeFormat("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                            }).format(
                                                new Date(booking.date_end)
                                            )},
                                                  ${new Date(
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

            <div className="p-3 mt-4">
                <button
                    onClick={onClose}
                    className="px-6 py-3 font-medium text-black bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 drop-shadow-sm"
                >
                    Close
                </button>
            </div>

            {isModalOpen && (
                <FinanceListingDetailsModal
                    listing={listing}
                    users={users}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default FinancePayoutDetails;
