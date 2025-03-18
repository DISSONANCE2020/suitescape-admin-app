import React, { useState, useEffect } from "react";
import TextButton from "./TextButton";

const PayoutsTable = ({
    bookings,
    users,
    listings,
    payoutMethods,
    currentPage,
    setCurrentPage,
}) => {
    const [filteredBookings, setFilteredBookings] = useState([]);
    const itemsPerPage = 5;

    useEffect(() => {
        if (!Array.isArray(bookings)) return;
        const sorted = [...bookings].sort(
            (a, b) =>
                new Date(b.updated_at || b.created_at) -
                new Date(a.updated_at || a.created_at)
        );
        setFilteredBookings(sorted);
    }, [bookings]);

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentBookings = filteredBookings.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <div className="rounded-lg pt-2 flex flex-col w-full max-w-full">
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
                                Mode of Payment
                            </th>
                            <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                Payout Amount
                            </th>
                            <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                Status
                            </th>
                            <th className="p-2 border border-[#D1D5DB] w-[180px]">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBookings.map((booking, index) => {
                            const listing = listings?.find(
                                (l) => l.id === booking?.listing_id
                            );
                            const host = users?.find(
                                (h) => h.id === listing?.user_id
                            );
                            const payoutMethod = payoutMethods?.find(
                                (p) => p.user_id === host?.id
                            );

                            return (
                                <tr
                                    key={booking.id || index}
                                    className="text-center border border-[#D1D5DB] odd:bg-[#F3F4F6] hover:bg-[#E5E7EB] transition duration-200"
                                >
                                    <td className="p-2 overflow-hidden whitespace-nowrap capitalize">
                                        {host
                                            ? `${host.firstname} ${host.lastname}`
                                            : "Unknown"}
                                    </td>
                                    <td className="p-2 overflow-hidden whitespace-nowrap capitalize text-xs">
                                        {listing?.name}
                                    </td>
                                    <td className="p-2 overflow-hidden whitespace-nowrap capitalize">
                                        {booking.date_start && booking.date_end
                                            ? `${new Intl.DateTimeFormat(
                                                  "en-US",
                                                  {
                                                      month: "short",
                                                      day: "2-digit",
                                                  }
                                              ).format(
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
                                    <td className="p-2 overflow-hidden whitespace-nowrap capitalize">
                                        {payoutMethod?.type || "N/A"}
                                    </td>
                                    <td className="p-2 overflow-hidden whitespace-nowrap capitalize">
                                        ₱
                                        {Number(booking?.amount).toLocaleString(
                                            "en-US",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </td>
                                    <td className="p-2 overflow-hidden whitespace-nowrap capitalize">
                                        {payoutMethod?.status || "N/A"}
                                    </td>
                                    <td className="p-2">
                                        <TextButton
                                            onClick={() => {
                                                console.log(
                                                    "View details for",
                                                    booking
                                                );
                                            }}
                                        >
                                            View Details
                                        </TextButton>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls at the Bottom of the Table */}
            <div className="flex justify-between items-center pt-4 px-2">
                <button
                    className="px-4 py-2 bg-[#E5E7EB] rounded-lg disabled:opacity-50"
                    onClick={() =>
                        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
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
        </div>
    );
};

export default PayoutsTable;
