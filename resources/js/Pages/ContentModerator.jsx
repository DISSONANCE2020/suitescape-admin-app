import React from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";
import ContentCard from "../Components/ContentCard";
import VideoManagement from "../Components/VideoManagement";
import PageHeader from "../Components/PageHeader";

const ContentModerator = () => {
    const { videos = [], users = [], listings = [], auth } = usePage().props;

    console.log("Listings from Inertia:", listings);
    if (!listings || !Array.isArray(listings)) {
        console.error("❌ Error: listings data is missing or not an array.");
    }

    const user = auth?.user || {};
    const userRoles = auth?.roles || []; // Assuming roles come from props

    // Check if user has role_id = 4
    const hasAccess = userRoles.some((role) => role.id === 4);

    if (!hasAccess) {
        return <div>Access Denied</div>;
    }

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar />
            <div className="flex-1 pb-2 pl-6 pr-6">
                <PageHeader
                    breadcrumb="Content Moderation / Videos"
                    user={{ name: user.firstname, role: "Content Moderator" }}
                />
                <ContentCard title="Videos">
                    <VideoManagement
                        initialVideos={videos}
                        users={users}
                        listings={listings}
                    />
                </ContentCard>
            </div>
        </div>
    );
};

export default ContentModerator;
