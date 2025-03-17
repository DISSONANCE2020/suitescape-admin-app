import React from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";
import ContentCard from "../Components/ContentCard";
import UserManagement from "../Components/UserManagement";
import PageHeader from "../Components/PageHeader";

const SuperAdmin = () => {
    const { videos = [], users = [], listings = [], auth } = usePage().props;



    const user = auth?.user || {};

    return (
        <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <div className="flex-1 pb-2 px-4 md:px-6">
                <PageHeader
                    breadcrumb="User Management / Users"
                    user={{ name: user.firstname}}
                />
                <ContentCard title="Users">
                    <UserManagement
                        initialVideos={videos}
                        users={users}
                        listings={listings}
                    />
                </ContentCard>
            </div>
        </div>
    );
};

export default SuperAdmin;
