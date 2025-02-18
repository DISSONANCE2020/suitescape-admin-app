import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";
import ContentCard from "../Components/ContentCard";
import FinanceManagement from "../Components/FinanceManagement";
import PageHeader from "../Components/PageHeader";

const FinanceModerator = () => {
    const {
        bookings = [],
        users = [],
        listings = [],
        payoutMethods = [],
        payoutMethodDetails = [],
    } = usePage().props;

    // If bookings data is not available or empty
    if (!bookings || bookings.length === 0) {
        return (
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 pb-2 pl-6 pr-6 bg-red-500">
                    <PageHeader
                        breadcrumb="Financial Administrations / Payouts"
                        user={{ name: "Andrews", role: "Admin account" }}
                    />
                    <ContentCard title="Bookings">
                        <div className="p-4">
                            <p>No bookings data available.</p>
                        </div>
                    </ContentCard>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 pb-2 pl-6 pr-6">
                <PageHeader
                    breadcrumb="Content Management / Videos"
                    user={{ name: "Andrew", role: "Admin account" }}
                />
                {/* Content Card for Video Management */}
                <ContentCard title="Videos">
                    <FinanceManagement
                        initialBookings={bookings}
                        users={users}
                        listings={listings}
                        payoutMethod={payoutMethods}
                        payoutMethodDetails={payoutMethodDetails}
                    />
                </ContentCard>
            </div>
        </div>
    );
};

export default FinanceModerator;
