import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import FinancePayoutsTable from "./FinancePayoutsTable";
import FinanceRefundsTable from "./FinanceRefundsTable";

const FinanceManagement = () => {
    const { bookings, users, listings, payoutMethods, invoices } =
        usePage().props;
    const [activeTab, setActiveTab] = useState("payouts");
    const [currentPagePayouts, setCurrentPagePayouts] = useState(1);
    const [currentPageRefunds, setCurrentPageRefunds] = useState(1);
    const [selectedBooking, setSelectedBooking] = useState(null);

    console.log(usePage().props);

    // Filter bookings for each tab:
    const payouts = bookings.filter(
        (booking) => booking.status === "completed"
    );
    const refunds = bookings.filter(
        (booking) => booking.status === "cancelled"
    );

    const handleCloseDetails = () => {
        setSelectedBooking(null);
    };

    const handleUpdateStatus = (bookingId, newStatus) => {
        // Implement your status update logic here
        console.log(`Updating status of booking ${bookingId} to ${newStatus}`);
    };

    return (
        <div className="flex-1 pb-2">
            {/* Tab Switcher */}
            {!selectedBooking && (
                <div className="flex justify-start gap-4 mb-4 border-b border-[#D1D5DB] pb-4">
                    <button
                        className={`px-4 py-2 font-semibold focus:outline-none ${
                            activeTab === "payouts"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-500"
                        }`}
                        onClick={() => {
                            setActiveTab("payouts");
                            setCurrentPagePayouts(1);
                        }}
                    >
                        Payouts
                    </button>

                    <button
                        className={`px-4 py-2 font-semibold focus:outline-none ${
                            activeTab === "refunds"
                                ? "border-b-2 border-red-600 text-red-600"
                                : "text-gray-500"
                        }`}
                        onClick={() => {
                            setActiveTab("refunds");
                            setCurrentPageRefunds(1);
                        }}
                    >
                        Refunds
                    </button>
                </div>
            )}

            {activeTab === "payouts" ? (
                <FinancePayoutsTable
                    bookings={payouts}
                    users={users}
                    invoices={invoices}
                    listings={listings}
                    payoutMethods={payoutMethods}
                    currentPage={currentPagePayouts}
                    setCurrentPage={setCurrentPagePayouts}
                    setSelectedBooking={setSelectedBooking}
                    selectedBooking={selectedBooking}
                />
            ) : (
                <FinanceRefundsTable
                    refunds={refunds}
                    users={users}
                    listings={listings}
                    payoutMethods={payoutMethods}
                    setSelectedBooking={setSelectedBooking} // Pass the prop
                    selectedBooking={selectedBooking} // Pass the prop
                />
            )}
        </div>
    );
};

export default FinanceManagement;
