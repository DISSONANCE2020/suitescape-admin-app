import React, { useState, useEffect } from "react";
import FinancePayoutDetails from "./FinancePayoutDetails"; // Import the new component

const FinancePayoutsTable = ({
    bookings,
    users,
    listings,
    invoices, // Ensure invoices is destructured
    payoutMethods,
    currentPage,
    setCurrentPage,
    setSelectedBooking, // Add this prop
    selectedBooking, // Add this prop
}) => {
    const [filteredBookings, setFilteredBookings] = useState([]);
    const itemsPerPage = 10;

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

    const handleRowClick = (booking) => {
        setSelectedBooking(booking);
    };

    const handleCloseDetails = () => {
        setSelectedBooking(null);
    };

    const handleUpdateStatus = (bookingId, newStatus) => {
        // Implement your status update logic here
        console.log(`Updating status of booking ${bookingId} to ${newStatus}`);
    };

    return (
        <div className="flex flex-col w-full h-full max-w-full pt-2 rounded-lg">
            {!selectedBooking && (
                <>
                    <div className="w-full max-w-full overflow-x-auto">
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
                                        Payout Amount
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Booking Status
                                    </th>
                                    <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                        Payout Status
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
                                            className="border border-[#D1D5DB] text-center odd:bg-[#F3F4F6] hover:bg-[#E5E7EB] cursor-pointer transition duration-200"
                                            onClick={() =>
                                                handleRowClick(booking)
                                            }
                                        >
                                            <td className="p-2 overflow-hidden capitalize whitespace-nowrap">
                                                {host
                                                    ? `${host.firstname} ${host.lastname}`
                                                    : "Unknown"}
                                            </td>
                                            <td className="p-2 overflow-hidden text-xs capitalize whitespace-nowrap">
                                                {listing?.name}
                                            </td>
                                            <td className="p-2 overflow-hidden capitalize whitespace-nowrap">
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

                                            <td className="p-2 overflow-hidden capitalize whitespace-nowrap">
                                                ₱
                                                {Number(
                                                    booking?.amount
                                                ).toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="p-2 overflow-hidden capitalize whitespace-nowrap">
                                                {booking?.status || "N/A"}
                                            </td>
                                            <td className="p-2 overflow-hidden capitalize whitespace-nowrap">
                                                {payoutMethod?.transfer_status ||
                                                    "N/A"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Hide pagination when a booking is selected */}

                    <div className="flex items-center justify-between px-2 pt-4 mt-auto">
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
                <FinancePayoutDetails
                    users={users}
                    invoices={invoices} // Pass invoices to FinancePayoutDetails
                    listings={listings}
                    payoutMethods={payoutMethods}
                    booking={selectedBooking}
                    onClose={handleCloseDetails}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    );
};

export default FinancePayoutsTable;
