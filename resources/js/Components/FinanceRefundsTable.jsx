import React, { useState, useEffect } from "react";
import FinanceRefundDetails from "./FinanceRefundDetails"; // Import the component to show detailed refund info

const FinanceRefundsTable = ({
    refunds,
    users,
    listings,
    payoutMethods,
    setSelectedBooking,
    selectedBooking,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredRefunds, setFilteredRefunds] = useState([]);
    const itemsPerPage = 9;

    useEffect(() => {
        if (!Array.isArray(refunds)) return;
        const sorted = [...refunds].sort(
            (a, b) =>
                new Date(b.updated_at || b.created_at) -
                new Date(a.updated_at || a.created_at)
        );
        setFilteredRefunds(sorted);
    }, [refunds]);

    const totalPages = Math.ceil(filteredRefunds.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRefunds = filteredRefunds.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleRowClick = (booking) => {
        setSelectedBooking(booking);
    };

    const handleCloseDetails = () => {
        setSelectedBooking(null);
    };

    return (
        <div className="rounded-lg pt-2 h-full flex flex-col w-full max-w-full">
            {!selectedBooking && (
                <>
                    <div className="overflow-x-auto w-full max-w-full">
                        <table className="w-full table-fixed border border-[#D1D5DB] min-w-[600px]">
                            <thead>
                                <tr className="text-center">
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Recipient
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Listing Name
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Check-In/Out
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Refund Amount
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Booking Status
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Refund Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRefunds.map((booking, index) => {
                                    const listing = listings?.find(
                                        (l) => l.id === booking?.listing_id
                                    );
                                    const host = users?.find(
                                        (h) => h.id === listing?.user_id
                                    );
                                    const guest = users?.find(
                                        (u) => u.id === booking?.user_id
                                    );

                                    const refundStatus = booking.invoice
                                        ? booking.invoice.payment_status ===
                                          "paid"
                                            ? "REFUND PENDING"
                                            : booking.invoice.payment_status ===
                                              "refunded"
                                            ? "REFUND ISSUED"
                                            : "N/A"
                                        : "N/A";

                                    return (
                                        <tr
                                            key={booking.id || index}
                                            className="text-center border border-[#D1D5DB] odd:bg-[#F3F4F6] hover:bg-[#E5E7EB] transition duration-200 cursor-pointer"
                                            onClick={() =>
                                                handleRowClick(booking)
                                            }
                                        >
                                            <td className="p-2 overflow-hidden whitespace-nowrap capitalize">
                                                {guest
                                                    ? `${guest.firstname} ${guest.lastname}`
                                                    : "N/A"}
                                            </td>
                                            <td className="p-2 overflow-hidden whitespace-nowrap capitalize">
                                                {listing?.name ||
                                                    "N/A"}
                                            </td>
                                            <td className="p-2 overflow-hidden whitespace-nowrap capitalize">
                                                {booking.date_start &&
                                                booking.date_end
                                                    ? `${new Intl.DateTimeFormat(
                                                          "en-US",
                                                          {
                                                              month: "short",
                                                              day: "2-digit",
                                                          }
                                                      ).format(
                                                          new Date(
                                                              booking.date_start
                                                          )
                                                      )} - ${new Intl.DateTimeFormat(
                                                          "en-US",
                                                          {
                                                              month: "short",
                                                              day: "2-digit",
                                                          }
                                                      ).format(
                                                          new Date(
                                                              booking.date_end
                                                          )
                                                      )}, ${new Date(
                                                          booking.date_end
                                                      ).getFullYear()}`
                                                    : "N/A"}
                                            </td>
                                            <td className="p-2 overflow-hidden whitespace-nowrap capitalize">
                                                ₱
                                                {Number(
                                                    booking.amount
                                                ).toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="p-2 overflow-hidden whitespace-nowrap capitalize">
                                                {booking.status || "N/A"}
                                            </td>
                                            <td className="p-2 overflow-hidden whitespace-nowrap capitalize">
                                                <span
                                                    className={`px-3 py-1 text-white w-[180px] font-bold block mx-auto rounded-md ${
                                                        refundStatus ===
                                                        "REFUND PENDING"
                                                            ? "bg-[#EF4444]" // Red for Refund Pending
                                                            : refundStatus ===
                                                              "REFUND ISSUED"
                                                            ? "bg-[#10B981]" // Green for Refund Issued
                                                            : "bg-[#D1D5DB]" // Default gray for N/A
                                                    }`}
                                                >
                                                    {refundStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="mt-auto flex justify-between items-center pt-4 px-2">
                        <button
                            className="px-4 py-2 bg-[#E5E7EB] rounded-lg disabled:opacity-50"
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    prev > 1 ? prev - 1 : prev
                                )
                            }
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="text-lg font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="px-4 py-2 bg-[#E5E7EB] rounded-lg disabled:opacity-50"
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    prev < totalPages ? prev + 1 : prev
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {selectedBooking && (
                <FinanceRefundDetails
                    booking={selectedBooking}
                    users={users}
                    listings={listings}
                    payoutMethods={payoutMethods}
                    onClose={handleCloseDetails}
                />
            )}
        </div>
    );
};

export default FinanceRefundsTable;
