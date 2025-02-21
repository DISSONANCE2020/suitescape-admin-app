import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar"; // Ensure correct import
import PageHeader from "@/Components/PageHeader"; // Ensure correct import
import ContentCard from "@/Components/ContentCard"; // Ensure correct import
import FinanceTable from "@/Components/FinanceTable"; // Ensure correct import

const FinanceModerator = () => {
    // Extracting data from Laravel backend via Inertia
    const {
        bookings: initialBookings,
        users,
        listings,
        payoutMethods,
        payoutMethodDetails,
    } = usePage().props;

    const [bookings, setBookings] = useState(initialBookings);

    useEffect(() => {
        setBookings(initialBookings);
    }, [initialBookings]);

    return (
        <div className="flex h-screen">
            {/* Sidebar - Fixed Width */}
            <div className="w-64">
                <Sidebar />
            </div>

            {/* Main Content - Expands Fully */}
            <div className="flex flex-col flex-1 p-6 overflow-auto">
                {/* Page Header */}
                <PageHeader breadcrumb="Finance Moderator / Payouts" />

                {/* Content Card */}
                <ContentCard>
                    {/* Finance Table */}
                    <FinanceTable
                        bookings={bookings}
                        users={users}
                        listings={listings}
                        payoutMethods={payoutMethods}
                        payoutMethodDetails={payoutMethodDetails}
                    />
                </ContentCard>
            </div>
        </div>
    );
};

export default FinanceModerator;
