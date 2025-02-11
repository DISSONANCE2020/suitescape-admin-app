import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import VideoTable from "./VideoTable";
import VideoDetails from "./VideoDetails";

const VideoManagement = () => {
    const { videos: initialVideos, users, listings } = usePage().props;
    const [videos, setVideos] = useState(initialVideos);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [sortBy, setSortBy] = useState("ALL");

    useEffect(() => {
        setVideos(initialVideos);
    }, [initialVideos]);

    const handleRowClick = (video) => {
        const listing = listings?.find(
            (listing) => listing.id === video.listing_id
        );
        const host = users?.find((user) => user.id === listing?.user_id);

        setSelectedVideo({
            ...video,
            host: host ? `${host.firstname} ${host.lastname}` : "Unknown",
            listingName: listing?.name,
            listingDescription: listing?.description, // Added description retrieval
        });
    };

    const handleStatusUpdate = async (updatedVideo) => {
        try {
            await router.put(`/videos/${updatedVideo.id}/status`, {
                is_approved: updatedVideo.is_approved,
                updated_at: new Date().toISOString(),
            });

            setVideos((prevVideos) =>
                prevVideos.map((video) =>
                    video.id === updatedVideo.id
                        ? { ...video, is_approved: updatedVideo.is_approved }
                        : video
                )
            );

            setSelectedVideo((prev) =>
                prev ? { ...prev, is_approved: updatedVideo.is_approved } : null
            );
        } catch (error) {
            console.error("Error updating video status:", error);
        }
    };

    // Filter videos based on sortBy state
    const filteredVideos = videos.filter((video) => {
        if (sortBy === "ALL") return true;
        if (sortBy === "VIDEO APPROVED") return video.is_approved === 1;
        if (sortBy === "VIDEO REJECTED") return video.is_approved === 2;
        if (sortBy === "PENDING APPROVAL") return video.is_approved === null;
        return true;
    });

    return (
        <div className="flex flex-col h-full">
            {/* Sorting Bar - Always Visible */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4">
                <h2 className="text-lg font-semibold">Videos</h2>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 w-[220px] border border-gray-300 rounded-md"
                >
                    <option value="ALL">All</option>
                    <option value="VIDEO APPROVED">Approved Videos</option>
                    <option value="VIDEO REJECTED">Rejected Videos</option>
                    <option value="PENDING APPROVAL">Pending Approval</option>
                </select>
            </div>

            {selectedVideo ? (
                <VideoDetails
                    video={selectedVideo}
                    onBack={() => setSelectedVideo(null)}
                    onStatusUpdate={handleStatusUpdate}
                />
            ) : (
                <div className="flex-grow">
                    <VideoTable
                        videos={filteredVideos}
                        users={users}
                        listings={listings}
                        onRowClick={handleRowClick}
                    />
                </div>
            )}
        </div>
    );
};

export default VideoManagement;
