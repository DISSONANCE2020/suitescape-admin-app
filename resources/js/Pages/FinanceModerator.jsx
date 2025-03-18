import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import FinanceTable from "@/Components/FinanceTable";
import Pagination from "@/Components/Pagination"; // Import Pagination Component

const FinanceModerator = () => {
    const {
        bookings: initialBookings,
        users,
        listings,
        payoutMethods,
    } = usePage().props;

    const [bookings, setBookings] = useState(initialBookings);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        setBookings(initialBookings);
    }, [initialBookings]);

    // Filter Payouts Only (Removing Tab Logic)
    const filteredPayouts = bookings.filter(
        (booking) => booking.status == "completed"
    );

    // Pagination Logic
    const getPaginatedData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 p-6 overflow-auto bg-gray-100">
                {/* Page Header */}
                <PageHeader
                    breadcrumb="Content Moderation / Payouts"
                    // user={{ name: user.firstname, role: "Finance Moderator" }}
                />
                <FinanceTable
                    bookings={getPaginatedData(filteredPayouts)}
                    users={users}
                    listings={listings}
                    payoutMethods={payoutMethods}
                />
            </div>
        </div>
    );
};

export default FinanceModerator;
