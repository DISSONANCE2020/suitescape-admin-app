import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import ContentCard from "@/Components/ContentCard";
import FinanceTable from "@/Components/FinanceTable";
import FinanceRefund from "@/Components/FinanceRefund";
import Pagination from "@/Components/Pagination"; // Import Pagination Component

const FinanceModerator = () => {
    const { bookings: initialBookings, users, listings, payoutMethods, payoutMethodDetails } = usePage().props;

    const [bookings, setBookings] = useState(initialBookings);
    const [activeTab, setActiveTab] = useState("payouts");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        setBookings(initialBookings);
    }, [initialBookings]);

    // Filter Data Based on Active Tab
    const filteredPayouts = bookings.filter((booking) => booking.status !== "cancelled");
    const filteredRefunds = bookings.filter((booking) => booking.status === "cancelled");

    // Pagination Logic
    const getPaginatedData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    const totalPages = activeTab === "payouts"
        ? Math.ceil(filteredPayouts.length / itemsPerPage)
        : Math.ceil(filteredRefunds.length / itemsPerPage);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 p-6 overflow-auto bg-gray-100">
                {/* Page Header */}
                <PageHeader breadcrumb={`Finance Moderator / ${activeTab === "payouts" ? "Payouts" : "Refunds"}`} />

                {/* Content Card */}
                <ContentCard>
                    {/* Tab Switcher */}
                    <div className="flex justify-start gap-4 mb-4">
                        <button
                            className={`px-4 py-2 font-semibold focus:outline-none ${
                                activeTab === "payouts" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
                            }`}
                            onClick={() => {
                                setActiveTab("payouts");
                                setCurrentPage(1);
                            }}
                        >
                            Payouts
                        </button>

                        <button
                            className={`px-4 py-2 font-semibold focus:outline-none ${
                                activeTab === "refunds" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500"
                            }`}
                            onClick={() => {
                                setActiveTab("refunds");
                                setCurrentPage(1);
                            }}
                        >
                            Refunds
                        </button>
                    </div>

                    {/* Render Table Based on Active Tab */}
                    {activeTab === "payouts" ? (
                        <FinanceTable
                            bookings={getPaginatedData(filteredPayouts)}
                            users={users}
                            listings={listings}
                            payoutMethods={payoutMethods}
                            payoutMethodDetails={payoutMethodDetails}
                        />
                    ) : (
                        <FinanceRefund
                            refunds={getPaginatedData(filteredRefunds)} // ✅ Pass correct data
                            users={users}
                            listings={listings}
                            payoutMethods={payoutMethods}
                            payoutMethodDetails={payoutMethodDetails}
                        />
                    )}
                </ContentCard>

                {/* Pagination Component */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default FinanceModerator;
