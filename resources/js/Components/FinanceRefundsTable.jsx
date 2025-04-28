import React, { useState, useEffect } from "react";
import FinanceRefundDetails from "./FinanceRefundDetails"; // Import the component to show detailed refund info
import Pagination from "./Pagination";

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex flex-col h-[67.5vh] w-full">
            {!selectedBooking && (
                <>
                    <div className="flex-grow overflow-x-auto">
                        <table className="w-full table-fixed border border-[#D1D5DB] bg-transparent">
                            <thead>
                                <tr className="text-center">
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Guest
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Listing Name
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Booking Date
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
                                            className="h-12 border border-[#D1D5DB] text-center odd:bg-transparent hover:bg-[#E5E7EB] cursor-pointer transition duration-200"
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
                                                    className={`px-3 py-1 text-white w-[160px] font-bold block mx-auto rounded-md ${
                                                        refundStatus ===
                                                        "REFUND PENDING"
                                                            ? "bg-[#EF4444]" 
                                                            : refundStatus ===
                                                              "REFUND ISSUED"
                                                            ? "bg-[#10B981]" 
                                                            : "bg-[#D1D5DB]" 
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
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
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
