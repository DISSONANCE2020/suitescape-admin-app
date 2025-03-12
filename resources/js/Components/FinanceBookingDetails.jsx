import React, { useState } from "react";
import ContentCard from "./ContentCard";
import TextButtonListing from "./TextButtonListing";
import ListingDetailsModal from "./ListingDetailsModal";

const FinanceBookingDetails = ({
    booking,
    listing,
    user,
    host,
    payoutMethod,
    onClose,
    onUpdateStatus,
}) => {
    if (!booking) return null;

    const [isExpanded, setIsExpanded] = useState(false);
    const amountPaid = parseFloat(booking.amount) || 0;
    const hostPayout = amountPaid;
    const [status, setStatus] = useState(payoutMethod?.status || "N/A");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleLocation = () => {
        setIsExpanded(!isExpanded);
    };

    const truncatedLocation =
        booking?.listing?.location?.length > 30
            ? booking.listing.location.substring(0, 30) + "..."
            : booking?.listing?.location || "N/A";

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        onUpdateStatus(booking.id, newStatus);
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="">
            <ContentCard>
                {/* Header Section */}
                <h2 className="m-4 text-4xl font-semibold capitalize">
                    {booking.listing?.facility_type || "N/A"}
                </h2>
                <p className="m-4 text-2xl capitalize font-poppins">
                    {booking?.listing ? booking.listing.name : "Unknown"}
                </p>
                <div className="mt-6 mb-6 border border-gray-200"></div>

                {/* Two-Column Layout */}
                <div className="grid grid-flow-col grid-cols-2">
                    {/* Left Column - Payout Details */}
                    <div>
                        <h3 className="mb-5 ml-4 text-2xl font-semibold text-gray-500">
                            Payout Details
                        </h3>
                        <table className="w-full">
                            <tbody>
                                {/* Host Email for Payout */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Listing ID:
                                    </td>
                                    <TextButtonListing
                                        className="pb-4"
                                        onClick={handleModalOpen}
                                    >
                                        {booking?.listing_id || "N/A"}
                                    </TextButtonListing>
                                </tr>
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Email:
                                    </td>
                                    <td className="pb-4 text-xl">
                                        {booking?.host?.email || "N/A"}
                                    </td>
                                </tr>

                                {/* Account Name */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Account Name:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        {payoutMethod?.payoutable_type || "N/A"}
                                    </td>
                                </tr>

                                {/* Payout Method */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Payout Method:
                                    </td>
                                    <td className="pb-4 text-xl capitalize"></td>
                                </tr>

                                {/* Account Number */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Account Number:
                                    </td>
                                    <td className="pb-4 text-xl capitalize ">
                                        {/* {payoutMethodDetail?.account_number ||
                                        "09123456789"} */}
                                    </td>
                                </tr>

                                {/* Amount Paid */}
                                <tr>
                                    <td className="pt-12 pb-4 pl-6 text-xl font-semibold">
                                        Booking Amount:
                                    </td>
                                    <td className="pt-12 pb-4 text-xl capitalize ">
                                        ₱
                                        {Number(amountPaid).toLocaleString(
                                            "en-US",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </td>
                                </tr>

                                {/* Host Payout */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Host Payout:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        ₱
                                        {Number(hostPayout).toLocaleString(
                                            "en-US",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </td>
                                </tr>

                                {/* Payout Status */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Payout Status:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        <select
                                            value={status}
                                            onChange={handleStatusChange}
                                        >
                                            <option value="Payout Pending">
                                                Payout Pending
                                            </option>
                                            <option value="Payout Sent">
                                                Payout Sent
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Right Column - Booking Details */}
                    <div>
                        <h3 className="mb-5 ml-4 text-2xl font-semibold text-gray-500">
                            Booking Details
                        </h3>
                        <table className="w-full">
                            <tbody>
                                {/* Guest Name */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Guest Name:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        {`${booking.user?.firstname} ${booking.user?.lastname}`}
                                    </td>
                                </tr>

                                {/* Booking Reference */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Booking No:
                                    </td>
                                    <td className="pb-4 text-xl">
                                        {booking.id || "N/A"}
                                    </td>
                                </tr>

                                {/* Mode of Payment */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Mode of Payment:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        {booking.paymongo_customer_id || "N/A"}
                                    </td>
                                </tr>

                                {/* Amount Paid */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Amount Paid:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        ₱
                                        {Number(booking?.amount).toLocaleString(
                                            "en-US",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </td>
                                </tr>

                                {/* Paid Amount Date */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
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

                                {/* Booking Date */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Booking Date:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        {booking.date_start && booking.date_end
                                            ? `${new Intl.DateTimeFormat(
                                                  "en-US",
                                                  {
                                                      month: "short",
                                                      day: "2-digit",
                                                  }
                                              ).format(
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

                                {/* Booking Status */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
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

                {/* Close Button */}
                <div className="flex p-3 mt-12">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 font-medium text-black bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 drop-shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </ContentCard>

            {/* Modal */}
            <ListingDetailsModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
            >
                <h2 className="mb-6 text-2xl font-semibold text-gray-500">
                    Listing Details
                </h2>
                <div className="flex">
                    {/* Left Column (Labels) */}
                    <div className="flex-1 pr-4">
                        <tr>
                            <td className="pb-4 ml-3 text-xl capitalize">
                                Host Name:
                            </td>
                        </tr>
                        <tr>
                            <td className="pb-4 ml-3 text-xl capitalize">
                                Facility Type:
                            </td>
                        </tr>
                        <tr>
                            <td className="pb-4 ml-3 text-xl capitalize">
                                Location:
                            </td>
                        </tr>
                        <tr>
                            <td className="pb-4 ml-3 text-xl capitalize">
                                Check-in time:
                            </td>
                        </tr>
                        <tr>
                            <td className="pb-4 ml-3 text-xl capitalize">
                                Check out time:
                            </td>
                        </tr>
                        <button
                            onClick={handleModalClose}
                            className="px-4 py-2 mt-8 text-white bg-blue-500 rounded"
                        >
                            Close
                        </button>
                    </div>

                    {/* Right Column (Values) */}
                    <div className="flex-1">
                        <tr>
                            <td className="pb-4 ml-3 text-xl capitalize">
                                {booking
                                    ? `${booking?.host?.firstname} ${booking?.host?.lastname}`
                                    : "Unknown"}
                            </td>
                        </tr>
                        <tr>
                            <td className="pb-4 ml-3 text-xl capitalize">
                                {booking?.listing?.facility_type || "N/A"}
                            </td>
                        </tr>
                        <tr>
                            <td className="pb-4 ml-3 text-xl capitalize">
                                <span>
                                    {isExpanded
                                        ? booking?.listing?.location || "N/A"
                                        : truncatedLocation}
                                </span>
                                {booking?.listing?.location?.length > 20 && (
                                    <button
                                        onClick={toggleLocation}
                                        className="ml-1 text-blue-500 hover:text-blue-700"
                                    >
                                        {isExpanded ? "Show Less" : "Show More"}
                                    </button>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="pb-4 ml-3 text-xl capitalize">
                                {booking?.listing?.check_in_time || "N/A"}
                            </td>
                        </tr>
                        <tr>
                            <td className="pb-4 ml-3 text-xl capitalize">
                                {booking?.listing?.check_out_time || "N/A"}
                            </td>
                        </tr>
                    </div>
                </div>
            </ListingDetailsModal>
        </div>
    );
};

export default FinanceBookingDetails;
