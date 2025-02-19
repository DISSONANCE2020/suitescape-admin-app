import React, { useState, useEffect } from "react";
import FinanceBookingDetails from "./FinanceBookingDetails";
// Import the new component

const FinanceTable = ({
    bookings,
    users,
    listings,
    payoutMethods,
    payoutMethodDetails,
}) => {
    const [sortedBookings, setSortedBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const itemsPerPage = 7;

    useEffect(() => {
        if (!Array.isArray(bookings)) return;
        let latestBookings = [...bookings].sort(
            (a, b) =>
                new Date(b.updated_at || b.created_at) -
                new Date(a.updated_at || a.created_at)
        );
        setSortedBookings(latestBookings);
    }, [bookings]);

    const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentBookings = sortedBookings.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <div className="rounded-lg pt-2 h-[67.5vh] flex flex-col w-full max-w-full">
            {selectedBooking ? (
                // Show Booking Details Component
                <FinanceBookingDetails
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            ) : (
                <>
                    {/* Table Section */}
                    <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4">
                        <h2 className="text-lg font-semibold">Payouts</h2>
                    </div>
                    <div className="overflow-x-auto w-full max-w-full">
                        <table className="w-full table-fixed border border-gray-300 min-w-[600px]">
                            <thead>
                                <tr className="text-center">
                                    <th className="p-2 border border-gray-300 w-[150px]">
                                        Facility Type
                                    </th>
                                    <th className="p-2 border border-gray-300 w-[150px]">
                                        Check-In/Out
                                    </th>
                                    <th className="p-2 border border-gray-300 w-[150px]">
                                        Mode of Payment
                                    </th>
                                    <th className="p-2 border border-gray-300 w-[180px]">
                                        Amount to Pay
                                    </th>
                                    <th className="p-2 border border-gray-300 w-[180px]">
                                        Host
                                    </th>
                                    <th className="p-2 border border-gray-300 w-[180px]">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentBookings.map((booking, index) => {
                                    const listing = listings?.find(
                                        (l) => l.id === booking?.listing_id
                                    );
                                    const user = users?.find(
                                        (u) => u.id === booking?.user_id
                                    );
                                    const host = users?.find(
                                        (h) => h.id === listing?.user_id
                                    );
                                    const payoutMethod = payoutMethods?.find(
                                        (p) => p.user_id === host?.id
                                    );
                                    const payoutMethodDetail =
                                        payoutMethodDetails?.find(
                                            (d) =>
                                                d.payout_method_id ===
                                                payoutMethod?.id
                                        );

                                    return (
                                        <tr
                                            key={booking.id || index}
                                            className="border border-gray-300 text-center odd:bg-gray-100 hover:bg-gray-200 cursor-pointer transition duration-200"
                                            onClick={() =>
                                                setSelectedBooking({
                                                    ...booking,
                                                    user,
                                                    listing,
                                                    payoutMethodDetail,
                                                })
                                            }
                                        >
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap">
                                                {listing?.facility_type}
                                            </td>
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap">
                                                {`${booking?.date_start} - ${booking?.date_end}`}
                                            </td>
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap">
                                                {payoutMethodDetail?.type ||
                                                    "N/A"}
                                            </td>
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap">
                                                ₱{booking?.amount}
                                            </td>
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap">
                                                <span className="px-3 py-1 text-white font-bold rounded-md bg-red-500 block mx-auto w-[200px] overflow-hidden text-ellipsis">
                                                    {host
                                                        ? `${host?.firstname} ${host?.lastname}`
                                                        : "Unknown"}
                                                </span>
                                            </td>
                                            <td className="p-2 w-[180px]">
                                                <span className="px-3 py-1 text-white w-[200px] font-bold block mx-auto rounded-md bg-blue-500">
                                                    PAYMENT PENDING
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-auto flex justify-between items-center pt-4 px-2">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
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
                            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
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
        </div>
    );
};

export default FinanceTable;
