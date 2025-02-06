import React, { useState } from "react";

const VideoTable = ({ videos, onRowClick }) => {
    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);

    // Sort videos by created_at in descending order (latest video first)
    const sortedVideos = [...videos].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Calculate total pages
    const totalPages = Math.ceil(sortedVideos.length / itemsPerPage);

    // Get videos for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentVideos = sortedVideos.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    // Debugging: Log the selected video when a row is clicked
    const handleRowClick = (video) => {
        console.log("Video selected: ", video); // Log the video data to the console
        if (onRowClick) {
            onRowClick(video); // Call the onRowClick function passed from the parent
        }
    };

    return (
        <div className="rounded-lg pt-2 h-[70vh] flex flex-col w-full max-w-full">
            {/* Scrollable table container */}
            <div className="overflow-x-auto w-full max-w-full">
                <table className="w-full table-fixed border border-gray-300 min-w-[600px]">
                    <thead>
                        <tr className="text-center">
                            <th className="p-2 border border-gray-300 w-[150px]">
                                Video ID
                            </th>
                            <th className="p-2 border border-gray-300 w-[150px]">
                                File Name
                            </th>
                            <th className="p-2 border border-gray-300 w-[150px]">
                                Upload Date
                            </th>
                            <th className="p-2 border border-gray-300 w-[180px]">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVideos.map((video, index) => (
                            <tr
                                key={index}
                                className="border border-gray-300 text-center odd:bg-gray-100 hover:bg-gray-200 cursor-pointer transition duration-200"
                                onClick={() => handleRowClick(video)} // Use the handleRowClick function to log and call onRowClick
                            >
                                <td className="p-2 w-[150px]">{video.id}</td>
                                <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap">
                                    {video.filename.length > 20
                                        ? `${video.filename.slice(0, 20)}...`
                                        : video.filename}
                                </td>
                                <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap">
                                    {video.created_at.slice(0, 10)}
                                </td>
                                <td className="p-2 w-[180px]">
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-auto flex justify-between items-center pt-4 px-2">
                <button
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <span className="text-lg font-medium">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

// Default prop for onRowClick
VideoTable.defaultProps = {
    onRowClick: () => {},
};

export default VideoTable;
