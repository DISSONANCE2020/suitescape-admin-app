import React from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";
import PageHeader from "../Components/PageHeader";
import ContentCard from "../Components/ContentCard";
import FinanceManagement from "@/Components/FinanceManagement";

const FinanceManager = () => {
    const { auth } = usePage().props;
    const user = auth?.user || {};

    return (
        <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
            {/* Sidebar */}
            <div className="hidden md:block h-screen">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col pb-5 px-4 md:px-6 h-screen overflow-hidden">
                <PageHeader
                    breadcrumb="Finance Management"
                    user={{ name: user.firstname, role: "Finance Moderator" }}
                />
                <div className="flex-1 overflow-auto">
                    <ContentCard title="Finance">
                        <FinanceManagement />
                    </ContentCard>
                </div>
            </div>
        </div>
    );
};

export default FinanceManager;
