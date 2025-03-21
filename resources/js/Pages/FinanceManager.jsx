import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";
import PageHeader from "../Components/PageHeader";
import ContentCard from "../Components/ContentCard";
import PayoutsTable from "../Components/PayoutsTable";
import RefundsTable from "../Components/RefundsTable";

const FinanceManager = () => {
    const {
        bookings,
        users,
        listings,
        payoutMethods,
        payoutMethodDetails,
        auth,
    } = usePage().props;

    const user = auth?.user || {};
    const [activeTab, setActiveTab] = useState("payouts");

    // Filter bookings for each tab:
    const payouts = bookings.filter(
        (booking) => booking.status !== "cancelled"
    );
    const refunds = bookings.filter(
        (booking) => booking.status === "cancelled"
    );

    return (
        <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <div className="flex-1 pb-2 px-4 md:px-6">
                <PageHeader
                    breadcrumb={`Finance Management / ${
                        activeTab === "payouts" ? "Payouts" : "Refunds"
                    }`}
                    user={{ name: user.firstname, role: "Finance Moderator" }}
                />
                <ContentCard title="Finance">
                    {/* Tab Switcher */}
                    <div className="flex justify-start gap-4 mb-4 border-b border-[#D1D5DB] pb-4">
                        <button
                            className={`px-4 py-2 font-semibold focus:outline-none ${
                                activeTab === "payouts"
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("payouts")}
                        >
                            Payouts
                        </button>
                        <button
                            className={`px-4 py-2 font-semibold focus:outline-none ${
                                activeTab === "refunds"
                                    ? "border-b-2 border-red-600 text-red-600"
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("refunds")}
                        >
                            Refunds
                        </button>
                    </div>

                    {/* Conditionally render only one component at a time */}
                    {activeTab === "payouts" ? (
                        <PayoutsTable
                            bookings={payouts}
                            users={users}
                            listings={listings}
                            payoutMethods={payoutMethods}
                        />
                    ) : (
                        <RefundsTable
                            refunds={refunds}
                            users={users}
                            listings={listings}
                            payoutMethods={payoutMethods}
                            payoutMethodDetails={payoutMethodDetails}
                        />
                    )}
                </ContentCard>
            </div>
        </div>
    );
};

export default FinanceManager;
