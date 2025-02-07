import React, { useState, useEffect } from "react";
import VideoTable from "./VideoTable";
import VideoDetails from "./VideoDetails";

const VideoManagement = ({ videos, users, listings }) => {

    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
    }, [selectedVideo]);

    const handleRowClick = (video) => {
        setSelectedVideo(video);
    };

    return (
        <div>
            {selectedVideo ? (
                <VideoDetails
                    video={selectedVideo}
                    onBack={() => setSelectedVideo(null)} // Call onBack to reset selectedVideo
                />
            ) : (
                <VideoTable
                    videos={videos}
                    users={users}
                    listings={listings}
                    onRowClick={handleRowClick}
                />
            )}
        </div>
    );
};

export default VideoManagement;
