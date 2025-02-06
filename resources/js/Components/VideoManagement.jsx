import React, { useState, useEffect } from "react";
import VideoTable from "./VideoTable";
import VideoDetails from "./VideoDetails";

const VideoManagement = ({ videos }) => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        console.log("selectedVideo state updated:", selectedVideo); // Log when selectedVideo changes
    }, [selectedVideo]);

    const handleRowClick = (video) => {
        console.log("Video selected in VideoManagement:", video);
        setSelectedVideo(video);
    };

    console.log("Current selectedVideo in VideoManagement:", selectedVideo);

    return (
        <div>
            {selectedVideo ? (
                <VideoDetails
                    video={selectedVideo}
                    onBack={() => setSelectedVideo(null)} // Call onBack to reset selectedVideo
                />
            ) : (
                <VideoTable videos={videos} onRowClick={handleRowClick} />
            )}
        </div>
    );
};

export default VideoManagement;
