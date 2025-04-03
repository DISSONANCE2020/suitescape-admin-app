import React, { useState, useEffect } from "react";
import FinanceRefundDetails from "./FinanceRefundDetails"; // Import the new component

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
                                        Host
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Listing Name
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Check-In/Out
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Mode of Refund
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Refund Amount
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Status
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

                                    return (
                                        <tr
                                            key={booking.id || index}
                                            className="text-center border border-[#D1D5DB] odd:bg-[#F3F4F6] hover:bg-[#E5E7EB] transition duration-200 cursor-pointer"
                                            onClick={() =>
                                                handleRowClick(booking)
                                            }
                                        >
                                            <td className="p-2 overflow-hidden whitespace-nowrap capitalize">
                                                {host
                                                    ? `${host.firstname} ${host.lastname}`
                                                    : "N/A"}
                                            </td>
                                            <td className="p-2 overflow-hidden whitespace-nowrap capitalize">
                                                {listing?.facility_type ||
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
                                                {booking.payment_mode || "N/A"}
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
