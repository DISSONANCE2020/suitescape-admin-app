import React, { useState, useEffect } from "react";
import FinanceBookingDetails from "./FinanceBookingDetails";
import TextButton from "./TextButton";

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

    const updateBooking = (updatedBooking) => {
        setSortedBookings((prevBookings) =>
            prevBookings.map((b) =>
                b.id === updatedBooking.id
                    ? { ...b, commissionRate: updatedBooking.commissionRate }
                    : b
            )
        );
        setSelectedBooking(null);
    };

    const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentBookings = sortedBookings.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <div className="rounded-lg pt-2 h-[67.5vh] flex flex-col w-full max-w-full">
            {selectedBooking ? (
                <FinanceBookingDetails
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onSave={updateBooking}
                />
            ) : (
                <>
                    <div className="flex items-center pb-4 mb-4 border-b border-gray-300">
                        <p className="text-xl font-semibold">Payouts</p>
                    </div>
                    <div className="w-full max-w-full overflow-x-auto">
                        <table className="w-full table-fixed border border-gray-300 min-w-[600px]">
                            <thead>
                                <tr className="text-center">
                                    <th className="p-2 border-x-2 border-gray-300 w-[150px]">
                                        Facility Type
                                    </th>
                                    <th className="p-2 border-x-2 border-gray-300 w-[150px]">
                                        Check-In/Out
                                    </th>
                                    <th className="p-2 border-x-2 border-gray-300 w-[150px]">
                                        Mode of Payment
                                    </th>
                                    <th className="p-2 border-x-2 border-gray-300 w-[180px]">
                                        Amount to Pay
                                    </th>
                                    <th className="p-2 border-x-2 border-gray-300 w-[180px]">
                                        Host
                                    </th>
                                    <th className="p-2 border-x-2 border-gray-300 w-[180px]">
                                        Status
                                    </th>
                                    <th className="p-2 border-x-2 border-gray-300 w-[180px]">
                                        Action
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
                                            className="text-center border border-gray-300 odd:bg-gray-100"
                                        >
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap capitalize">
                                                {listing?.facility_type}
                                            </td>
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap capitalize">{`${booking?.date_start} - ${booking?.date_end}`}</td>
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap capitalize">
                                                {payoutMethodDetail?.type ||
                                                    "N/A"}
                                            </td>
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap capitalize">
                                                ₱{booking?.amount}
                                            </td>
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap capitalize">
                                                <span className="block py-1 text-white font-bold rounded-md bg-red-500 mx-auto w-[180px] overflow-hidden text-ellipsis">
                                                    {host
                                                        ? `${host?.firstname} ${host?.lastname}`
                                                        : "Unknown"}
                                                </span>
                                            </td>
                                            <td className="p-2 w-[180px]">
                                                <span className="px-3 py-1 text-white w-[190px] font-bold block mx-auto rounded-md bg-[#3497e7]">
                                                    PAYMENT PENDING
                                                </span>
                                            </td>
                                            <td className="p-2 w-[180px]">
                                                <TextButton
                                                    key={booking.id || index}
                                                    className="text-center"
                                                    onClick={() =>
                                                        setSelectedBooking({
                                                            ...booking,
                                                            user,
                                                            listing,
                                                            payoutMethodDetail,
                                                        })
                                                    }
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

                    <div className="flex items-end justify-between px-2 pt-4 mt-auto">
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
