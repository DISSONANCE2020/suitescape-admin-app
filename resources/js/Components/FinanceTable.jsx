import React, { useState, useEffect } from "react";
import FinanceBookingDetails from "./FinanceBookingDetails";
import TextButton from "./TextButton";
import ContentCard from "./ContentCard";

const FinanceTable = ({ bookings, users, listings, payoutMethods }) => {
    const [sortedBookings, setSortedBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedPayoutMethod, setSelectedPayoutMethod] = useState(null);

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
            prevBookings.map((booking) =>
                booking.id === updatedBooking.id ? updatedBooking : booking
            )
        );
    };

    const handleViewDetails = (booking) => {
        const listing = listings?.find((l) => l.id === booking?.listing_id);
        const host = users?.find((h) => h.id === listing?.user_id);
        const payoutMethod = payoutMethods?.find((p) => p.user_id === host?.id);

        setSelectedBooking(booking);
        setSelectedPayoutMethod(payoutMethod);
    };

    return (
        <div>
            {selectedBooking ? (
                <FinanceBookingDetails
                    booking={selectedBooking}
                    payoutMethod={selectedPayoutMethod}
                    onClose={() => setSelectedBooking(null)}
                />
            ) : (
                <div className="max-w-full overflow-x-auto">
                    <ContentCard>
                        <table className="w-full mt-5 overflow-x-auto bg-white border border-gray-300">
                            <thead>
                                <tr className="text-center">
                                    <th className="p-2 border-x-2 border-gray-300 w-[180px]">
                                        Host
                                    </th>
                                    <th className="p-2 border-x-2 border-gray-300 w-[150px]">
                                        Listing Name
                                    </th>
                                    <th className="p-2 border-x-2 border-gray-300 w-[150px]">
                                        Check-In/Out
                                    </th>
                                    <th className="p-2 border-x-2 border-gray-300 w-[150px]">
                                        Mode of Payment
                                    </th>
                                    <th className="p-2 border-x-2 border-gray-300 w-[180px]">
                                        Payout Amount
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
                                {sortedBookings.map((booking, index) => {
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

                                    return (
                                        <tr
                                            key={booking.id || index}
                                            className="text-center border border-gray-300"
                                        >
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap capitalize">
                                                <span className="block py-1 text-black rounded-md mx-auto w-[180px] overflow-hidden text-ellipsis">
                                                    {host
                                                        ? `${host?.firstname} ${host?.lastname}`
                                                        : "Unknown"}
                                                </span>
                                            </td>
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap capitalize text-xs">
                                                {listing?.name}
                                            </td>
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap capitalize">
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
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap capitalize">
                                                {payoutMethod?.type || "N/A"}
                                            </td>
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap capitalize">
                                                ₱
                                                {Number(
                                                    booking?.amount
                                                ).toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap capitalize">
                                                {payoutMethod?.status || "N/A"}
                                            </td>
                                            <td className="p-2 w-[180px]">
                                                <TextButton
                                                    key={booking.id || index}
                                                    className="text-center"
                                                    onClick={() =>
                                                        handleViewDetails({
                                                            ...booking,
                                                            user,
                                                            host,
                                                            listing,
                                                            payoutMethod,
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
                    </ContentCard>
                </div>
            )}
        </div>
    );
};

export default FinanceTable;
