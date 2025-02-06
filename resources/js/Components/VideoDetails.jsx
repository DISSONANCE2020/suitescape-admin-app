import React from "react";

const VideoDetails = ({ video, onBack }) => {
    return (
        <div className="flex w-full h-full">
            {/* Video Player with Fixed Size (9:16 Aspect Ratio) */}
            <div className="relative w-56 h-96">
                <video className="absolute inset-0 w-full h-full object-cover" controls>
                    <source src={video.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Video Details on the Right */}
            <div className="flex-1 pl-6">
                <h2 className="text-xl font-semibold">{video.filename}</h2>
                <p className="text-sm text-gray-600">{video.created_at.slice(0, 10)}</p>
                <div className="mt-4">
                    <p className="text-lg">Status:</p>
                    <span
                        className={`px-3 py-1 text-white font-bold rounded-md ${
                            video.is_approved === null
                                ? "bg-blue-500"
                                : video.is_approved === 1
                                ? "bg-green-500"
                                : "bg-red-500"
                        }`}
                    >
                        {video.is_approved === null
                            ? "PENDING APPROVAL"
                            : video.is_approved === 1
                            ? "VIDEO APPROVED"
                            : "VIDEO REJECTED"}
                    </span>
                </div>

                <div className="mt-6">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200"
                    >
                        Back to Video List
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoDetails;
