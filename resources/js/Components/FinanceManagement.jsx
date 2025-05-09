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
    const [refundFilter, setRefundFilter] = useState("all");

    console.log(usePage().props);

    const payouts = bookings.filter(
        (booking) => booking.status === "completed"
    );
    const refunds = bookings.filter(
        (booking) => booking.status === "cancelled"
    );

    const filteredRefunds = refunds.filter((refund) => {
        if (refundFilter === "all") return true;
        const invoice = invoices.find((inv) => inv.booking_id === refund.id);
        return invoice?.payment_status === refundFilter;
    });

    const sortedRefunds = [...filteredRefunds].sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );

    return (
        <div className="flex-1 pb-2">
            {/* Tab Switcher */}
            {!selectedBooking && (
                <div className="flex justify-between items-center gap-4 mb-4 border-b border-[#D1D5DB] pb-4">
                    <div className="flex gap-4">
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

                    {/* Sorting Button for Refunds */}
                    {activeTab === "refunds" && (
                        <div className="flex items-center gap-2">
                            <select
                                id="refundFilter"
                                value={refundFilter}
                                onChange={(e) =>
                                    setRefundFilter(e.target.value)
                                }
                                className="px-3 py-2 w-[220px] border border-[#D1D5DB] rounded-md"
                            >
                                <option value="all">All</option>
                                <option value="paid">Refund Pending</option>
                                <option value="fully_refunded">
                                    Fully Refunded
                                </option>
                                <option value="partially_refunded">
                                    Partially Refunded
                                </option>
                            </select>
                        </div>
                    )}
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
                    refunds={sortedRefunds}
                    users={users}
                    listings={listings}
                    payoutMethods={payoutMethods}
                    invoices={invoices}
                    setSelectedBooking={setSelectedBooking}
                    selectedBooking={selectedBooking}
                />
            )}
        </div>
    );
};

export default FinanceManagement;
