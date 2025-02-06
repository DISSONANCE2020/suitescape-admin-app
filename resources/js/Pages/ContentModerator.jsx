import React from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";
import ContentCard from "../Components/ContentCard";
import VideoTable from "../Components/VideoTable";
import PageHeader from "../Components/PageHeader"; // Import new component

const ContentModerator = () => {
    const { videos } = usePage().props;

    return (
        <div className="flex bg-gray-100">
            <Sidebar />
            <div className="flex-1 pl-6 pr-6">
                {/* Page Header Component */}
                <PageHeader 
                    breadcrumb="Content Management / Videos"
                    user={{ name: "Andrew", role: "Admin account" }} 
                />
                
                <ContentCard title="Videos">
                    <VideoTable videos={videos} />
                </ContentCard>
            </div>
        </div>
    );
};

export default ContentModerator;
