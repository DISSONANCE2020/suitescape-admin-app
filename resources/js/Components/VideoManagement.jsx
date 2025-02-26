// VideoManagement.jsx
import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import VideoTable from "./VideoTable";
import VideoDetails from "./VideoDetails";

const VideoManagement = () => {
    const {
        videos: initialVideos,
        users,
        listings,
        currentModerator,
    } = usePage().props;
    const [videos, setVideos] = useState(initialVideos);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [sortBy, setSortBy] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => setVideos(initialVideos), [initialVideos]);

    const handleRowClick = (video) => {
        const listing = listings?.find(
            (listing) => listing.id === video.listing_id
        );
        const host = users?.find((user) => user.id === listing?.user_id);

        setSelectedVideo({
            ...video,
            host: host ? `${host.firstname} ${host.lastname}` : "Unknown",
            listingName: listing?.name,
            listingDescription: listing?.description,
            violations: video.violations || [],
        });
    };

    const handleStatusUpdate = async (updatedVideo) => {
        try {
            const payload = {
                is_approved: updatedVideo.is_approved,
                moderated_by:
                    updatedVideo.is_approved === null
                        ? null
                        : updatedVideo.moderated_by,
                violations: updatedVideo.violations,
                updated_at: new Date().toISOString(),
            };

            await router.put(`/videos/${updatedVideo.id}/status`, payload);

            setVideos((prev) =>
                prev.map((v) =>
                    v.id === updatedVideo.id
                        ? {
                              ...v,
                              is_approved: updatedVideo.is_approved,
                              moderated_by:
                                  updatedVideo.is_approved === null
                                      ? null
                                      : updatedVideo.moderated_by,
                              violations: updatedVideo.violations,
                          }
                        : v
                )
            );
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const handleViolationsSave = async (updatedVideoWithViolations) => {
        try {
            await router.put(
                `/videos/${updatedVideoWithViolations.id}/violations`,
                {
                    violations: updatedVideoWithViolations.violations,
                }
            );

            setVideos((prevVideos) =>
                prevVideos.map((video) =>
                    video.id === updatedVideoWithViolations.id
                        ? {
                              ...video,
                              violations: updatedVideoWithViolations.violations,
                          }
                        : video
                )
            );
            setSelectedVideo((prev) =>
                prev
                    ? {
                          ...prev,
                          violations: updatedVideoWithViolations.violations,
                      }
                    : null
            );
        } catch (error) {
            console.error("Error updating violations:", error);
        }
    };

    const filteredVideos = videos.filter((video) => {
        if (sortBy === "ALL") return true;
        if (sortBy === "VIDEO APPROVED") return video.is_approved === 1;
        if (sortBy === "VIDEO REJECTED") return video.is_approved === 2;
        if (sortBy === "PENDING APPROVAL") return video.is_approved === null;
        return true;
    });

    return (
        <div className="flex flex-col h-full">
            {/* Sorting Bar */}
            <div className="flex justify-between items-center mb-4 border-b border-[#D1D5DB] pb-4">
                <h2 className="text-lg font-semibold">Videos</h2>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 w-[220px] border border-[#D1D5DB] rounded-md"
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
                    currentModeratorId={currentModerator?.id}
                    users={users}
                    onBack={() => setSelectedVideo(null)}
                    onStatusUpdate={handleStatusUpdate}
                    onViolationsSave={handleViolationsSave}
                />
            ) : (
                <div className="flex-grow">
                    <VideoTable
                        videos={filteredVideos}
                        users={users}
                        listings={listings}
                        onRowClick={handleRowClick}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default VideoManagement;
