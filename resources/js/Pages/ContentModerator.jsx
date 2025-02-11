import React from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";
import ContentCard from "../Components/ContentCard";
import VideoManagement from "../Components/VideoManagement";
import PageHeader from "../Components/PageHeader";

const ContentModerator = () => {
    // Get videos, users, and listings from Inertia props
    const { videos = [], users = [], listings = [] } = usePage().props;

    // Debugging: Check if listings data is received
    console.log("Listings from Inertia:", listings);
    if (!listings || !Array.isArray(listings)) {
        console.error("❌ Error: listings data is missing or not an array.");
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
