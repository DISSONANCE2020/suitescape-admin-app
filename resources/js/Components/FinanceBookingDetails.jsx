import React, { useState } from "react";
import ContentCard from "./ContentCard";

const FinanceBookingDetails = ({
    booking,
    payoutMethodDetail,
    onClose,
    onUpdateStatus,
}) => {
    if (!booking) return null;

    const amountPaid = parseFloat(booking.amount) || 0;
    const hostPayout = amountPaid;
    const [status, setStatus] = useState(payoutMethodDetail?.status || "N/A");

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        onUpdateStatus(booking.id, newStatus);
    };

    return (
        <div className="">
            {/* Header Section */}
            <ContentCard>
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
                                        Email:
                                    </td>
                                    <td className="pb-4 text-xl">
                                        {payoutMethodDetail?.email ||
                                            "helloworld@gmail.com"}
                                    </td>
                                </tr>

                                {/* Account Name */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Account Name:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        {payoutMethodDetail?.account_name ||
                                            "Sample Account Name"}
                                    </td>
                                </tr>

                                {/* Payout Method */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Payout Method:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        {payoutMethodDetail?.type || "Gcash"}
                                    </td>
                                </tr>

                                {/* Account Number */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Account Number:
                                    </td>
                                    <td className="pb-4 text-xl capitalize ">
                                        {payoutMethodDetail?.account_number ||
                                            "09123456789"}
                                    </td>
                                </tr>

                                {/* Amount Paid */}
                                <tr>
                                    <td className="pt-12 pb-4 pl-6 text-xl font-semibold">
                                        Booking Amount:
                                    </td>
                                    <td className="pt-12 pb-4 text-xl capitalize ">
                                        ₱{amountPaid.toFixed(2)}
                                    </td>
                                </tr>

                                {/* Host Payout */}
                                <tr>
                                    <td className="pb-4 pl-6 text-xl font-semibold">
                                        Host Payout:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        ₱{hostPayout.toFixed(2)}
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
                                        {booking.amount || "N/A"}
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
        </div>
    );
};

export default FinanceBookingDetails;
