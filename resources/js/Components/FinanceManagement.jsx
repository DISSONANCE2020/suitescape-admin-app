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
    const [activeTab, setActiveTab] = useState("payouts");
    const [currentPagePayouts, setCurrentPagePayouts] = useState(1);
    const [currentPageRefunds, setCurrentPageRefunds] = useState(1);

    // Filter bookings for each tab:
    const payouts = bookings.filter(
        (booking) => booking.status !== "cancelled"
    );
    const refunds = bookings.filter(
        (booking) => booking.status === "cancelled"
    );

    const user = auth?.user || {};

    return (
        <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
            {/* Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 pb-2 px-4 md:px-6">
                <PageHeader
                    breadcrumb={`Finance Management / ${
                        activeTab === "payouts" ? "Payouts" : "Refunds"
                    }`}
                    user={{ name: user.firstname, role: "Finance Moderator" }}
                />

                <ContentCard title="Finance Records">
                    {/* Tab Switcher */}
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

                    {activeTab === "payouts" ? (
                        <PayoutsTable
                            bookings={payouts}
                            users={users}
                            listings={listings}
                            payoutMethods={payoutMethods}
                            currentPage={currentPagePayouts}
                            setCurrentPage={setCurrentPagePayouts}
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
