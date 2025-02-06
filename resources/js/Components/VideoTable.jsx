import React, { useState } from "react";

const VideoTable = ({ videos }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total pages
    const totalPages = Math.ceil(videos.length / itemsPerPage);

    // Get videos for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentVideos = videos.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="rounded-lg h-[490px] flex flex-col w-full max-w-full">
            {/* Scrollable table container */}
            <div className="overflow-x-auto w-full max-w-full">
                <table className="w-full border border-gray-300 min-w-[600px]">
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
                                className="border border-gray-300 text-center odd:bg-gray-100"
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
                                        className={`px-3 py-1 text-white rounded-md ${
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

export default VideoTable;
