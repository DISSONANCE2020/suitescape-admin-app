import React from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";
import ContentCard from "../Components/ContentCard";
import VideoManagement from "../Components/VideoManagement";
import PageHeader from "../Components/PageHeader"

const ContentModerator = () => {
    const { videos } = usePage().props;

    return (
        <div className="flex bg-gray-100">
            <Sidebar />
            <div className="flex-1 pb-2 pl-6 pr-6">
                <PageHeader
                    breadcrumb="Content Management / Videos"
                    user={{ name: "Andrew", role: "Admin account" }}
                />
                {/* Only render ContentCard with VideoManagement */}
                <ContentCard title="Videos">
                    <VideoManagement videos={videos} />
                </ContentCard>
            </div>
        </div>
    );
};

export default ContentModerator;
