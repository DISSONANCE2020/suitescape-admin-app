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
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <div className="flex-1 pb-2 px-4 md:px-6">
                <PageHeader breadcrumb="Finance Management" user={{ name: user.firstname, role: "Finance Moderator" }} />
                <ContentCard title="Finance">
                    <FinanceManagement/>
                </ContentCard>
            </div>
        </div>
    );
};

export default FinanceManager;
