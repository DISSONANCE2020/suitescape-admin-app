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
            <div className="hidden md:block h-screen">
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col pb-5 px-4 md:px-6 h-screen overflow-hidden">
                <PageHeader
                    breadcrumb="User Management / Users"
                    user={{ name: user.firstname }}
                />
                <div className="flex-1 overflow-auto">
                    {" "}
                    <ContentCard title="Users">
                        <UserManagement
                            initialVideos={videos}
                            users={users}
                            listings={listings}
                        />
                    </ContentCard>
                </div>
            </div>
        </div>
    );
};

export default SuperAdmin;
