import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FinanceBookingDetails = ({ booking, onClose, onSave }) => {
    if (!booking) return null;

    const [updatedBooking, setUpdatedBooking] = useState(booking);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(booking.status);
    const [commissionRate, setCommissionRate] = useState(2); // Default 2%
    const [savedCommissionRate, setSavedCommissionRate] = useState(2); // Saved value

    const amountPaid = parseFloat(booking.amount) || 0;
    const commission = (amountPaid * commissionRate) / 100;
    const hostPayout = amountPaid - commission;

    const handleSave = () => {
        onSave({
            ...updatedBooking,
            commissionRate: commissionRate, // Ensure it is passed when saving
        });
    };
    const handleSaveChanges = () => {
        setSavedCommissionRate(commissionRate); // Update saved commission rate
        setUpdatedBooking((prev) => ({
            ...prev,
            commissionRate: commissionRate, // Ensure the commission rate is updated in the booking data
        }));
    };

    const handleStatusChange = (newStatus) => {
        console.log("Status changed to:", newStatus);
        setSelectedStatus(newStatus);
        setDropdownOpen(false);
    };

    const getStatusText = (status) => {
        return status === 1 ? "PAYOUT SENT" : "PAYOUT PENDING";
    };

    return (
        <div className="">
            <h2 className="pl-3 mb-5 text-5xl font-semibold capitalize ">
                {booking.listing?.facility_type || "N/A"}
            </h2>
            <p className="pb-8 pl-3 text-3xl capitalize b-4 ">
                {booking?.listing ? booking.listing.name : "Unknown"}
            </p>
            <div className="mb-5 border border-gray-200"></div>

            <table className="w-auto">
                <tbody>
                    {/* Status Dropdown */}
                    <tr>
                        <td className="p-3 text-xl font-semibold">Status:</td>
                        <td className="relative p-3">
                            <button
                                className={`px-3 py-1 text-white font-bold rounded-md flex justify-between items-center w-full md:w-[220px] ${
                                    selectedStatus === 1
                                        ? "bg-[#10B981]"
                                        : "bg-[#3497e7] "
                                }`}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                {getStatusText(selectedStatus)}
                                <ChevronDown size={16} className="ml-2" />
                            </button>

                            {dropdownOpen && (
                                <div
                                    className="absolute mt-2 rounded-lg bg-white p-2 z-10 w-full md:w-[220px] shadow-lg"
                                    onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing immediately
                                >
                                    <button
                                        className="px-3 py-1 mt-2 text-white font-bold rounded-md flex justify-between items-start w-full bg-[#10B981] hover:bg-[#059669]"
                                        onClick={() => handleStatusChange(1)}
                                    >
                                        PAYOUT SENT
                                    </button>

                                    <button
                                        className="px-3 py-1 mt-2 text-white font-bold rounded-md flex justify-between items-start w-full bg-[#3497e7] hover:bg-[#1c78c4] "
                                        onClick={() => handleStatusChange(2)}
                                    >
                                        PAYOUT PENDING
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                    {/* Booking ID */}
                    <tr className="">
                        <td className="w-1/3 p-3 pb-2 text-xl font-semibold ">
                            Booking ID:
                        </td>
                        <td className="p-3 text-xl">
                            {booking.id || "No ID Available"}
                        </td>
                    </tr>

                    {/* Customer Name */}
                    <tr className="">
                        <td className="p-3 text-xl font-semibold">
                            Customer Name:
                        </td>
                        <td className="p-3 text-xl ">
                            {booking.user?.firstname} {booking.user?.lastname}
                        </td>
                    </tr>

                    {/* Check-in & Check-out */}
                    <tr className="">
                        <td className="p-3 text-xl font-semibold">Check-In:</td>
                        <td className="p-3 text-xl">
                            {new Date(booking.date_start).toLocaleDateString(
                                "en-US",
                                {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                }
                            )}{" "}
                            -{" "}
                            {new Date(booking.date_end).toLocaleDateString(
                                "en-US",
                                {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                }
                            )}
                        </td>
                    </tr>

                    {/* Mode of Payment */}
                    <tr className="">
                        <td className="p-3 text-xl font-semibold">
                            Mode of Payment:
                        </td>
                        <td className="p-3 text-xl ">
                            {booking.payoutMethodDetail?.type || "N/A"}
                        </td>
                    </tr>

                    {/* Amount Paid */}
                    <tr className="">
                        <td className="p-3 text-xl font-semibold pb-14">
                            Amount Paid:
                        </td>
                        <td className="p-3 text-xl pb-14">
                            ₱{amountPaid.toFixed(2)}
                        </td>
                    </tr>

                    {/* Suitescape Commission */}
                    <tr>
                        <td className="p-3 text-xl font-semibold">
                            Commission (%):
                        </td>
                        <td className="p-3">
                            <input
                                type="number"
                                className="w-20 p-2 border border-gray-300 rounded-md"
                                value={commissionRate}
                                onChange={(e) =>
                                    setCommissionRate(e.target.value)
                                }
                                min="0"
                                max="100"
                            />
                        </td>
                    </tr>

                    {/* Host Payout */}
                    <tr className="">
                        <td className="p-3 text-xl font-semibold">
                            Host Payout:
                        </td>
                        <td className="p-3 text-xl">
                            ₱{hostPayout.toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="flex p-3 mt-6 ">
                <button
                    onClick={handleSave}
                    className="px-6 py-3 font-medium text-white bg-blue-500 border border-blue-600 rounded-md hover:bg-blue-600 drop-shadow-sm"
                >
                    Save Changes
                </button>
                <button
                    onClick={onClose}
                    className="px-6 py-3 font-medium text-black bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 drop-shadow-sm"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default FinanceBookingDetails;
