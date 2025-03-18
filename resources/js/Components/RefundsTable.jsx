import React from "react";

const RefundsTable = ({
    refunds,
    users,
    listings,
    payoutMethods,
    payoutMethodDetails,
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="text-center">
                        <th className="p-2 border-x-2 border-gray-300 w-[150px]">
                            Facility Type
                        </th>
                        <th className="p-2 border-x-2 border-gray-300 w-[150px]">
                            Check-In/Out
                        </th>
                        <th className="p-1 border-x-2 border-gray-300 w-[150px]">
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
                    {refunds.length > 0 ? (
                        refunds.map((booking, index) => {
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
                                        d.payout_method_id === payoutMethod?.id
                                );

                            return (
                                <tr
                                    key={booking.id || index}
                                    className="text-center border border-gray-300 odd:bg-gray-100"
                                >
                                    <td className="border p-2">
                                        {listing?.facility_type || "N/A"}
                                    </td>
                                    <td className="border p-2">
                                        {booking?.check_in} -{" "}
                                        {booking?.check_out}
                                    </td>
                                    <td className="border p-2">
                                        {booking?.payment_mode || "N/A"}
                                    </td>
                                    <td className="border p-2">
                                        ${booking?.amount || "0.00"}
                                    </td>
                                    <td className="border p-2">
                                        {host?.name || "N/A"}
                                    </td>
                                    <td className="border p-2">
                                        {booking?.status}
                                    </td>
                                    <td className="border p-2">
                                        <button className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-700">
                                            Process Refund
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center border p-4">
                                No refunds available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RefundsTable;
