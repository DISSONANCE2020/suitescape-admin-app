import React from "react";

const FinanceRefundDetails = ({ booking, users, listings, onClose }) => {
    if (!booking) return null;

    const listing = listings?.find((l) => l.id === booking?.listing_id);
    const host = users?.find((u) => u.id === listing?.user_id);
    const guest = users?.find((u) => u.id === booking?.user_id);

    return (
        <div>
            <h2 className="m-2 pb-2 text-4xl font-semibold capitalize">
                {listing?.facility_type || "N/A"}
            </h2>
            <p className="m-2 text-2xl capitalize font-poppins">
                {listing?.name || "Unknown"}
            </p>
            <div className="mt-6 mb-6 border border-gray-300"></div>
            <div>
                <div className="">
                    <div>
                        <h3 className="mb-6 ml-2 text-2xl font-semibold text-gray-500 capitalize">
                            Refund Details
                        </h3>
                        <table className="w-full">
                            <tbody>
                                {/* Listing ID */}
                                <tr>
                                    <td className="pb-4 pl-4 text-xl font-semibold">
                                        Booking Reference No:
                                    </td>
                                    <td className="pb-4 text-xl">
                                        {booking?.id || "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pb-4 pl-4 text-xl font-semibold">
                                        Guest Name:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        {guest
                                            ? `${guest.firstname} ${guest.lastname}`
                                            : "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pb-4 pl-4 text-xl font-semibold">
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
                                <tr>
                                    <td className="pb-4 pl-4 text-xl font-semibold">
                                        Mode of Payment:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        {guest
                                            ? `${guest.firstname} ${guest.lastname}`
                                            : "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pb-4 pl-4 text-xl font-semibold">
                                        Refund Amount:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        ₱{booking?.amount || "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pb-4 pl-4 text-xl font-semibold">
                                        Company Commission:
                                    </td>
                                    <td className="pb-4 text-xl capitalize">
                                        ₱{booking?.amount || "N/A"}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <button
                onClick={onClose}
                className="mt-6 px-6 py-3 font-medium text-black bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 drop-shadow-sm"
            >
                Close
            </button>
        </div>
    );
};

export default FinanceRefundDetails;

{
    /* <p>
<strong>Listing:</strong> {listing?.name || "N/A"}
</p>
<p>
<strong>Host:</strong>{" "}
{host ? `${host.firstname} ${host.lastname}` : "N/A"}
</p>
<p>
<strong>Guest:</strong>{" "}
{guest ? `${guest.firstname} ${guest.lastname}` : "N/A"}
</p>
<p>
<strong>Check-In:</strong> {booking?.check_in || "N/A"}
</p>
<p>
<strong>Check-Out:</strong> {booking?.check_out || "N/A"}
</p>
<p>
<strong>Amount:</strong> ₱{booking?.amount || "0.00"}
</p>
<p>
<strong>Status:</strong> {booking?.status || "N/A"}
</p> */
}
