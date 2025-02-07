import React, { useState } from "react";

const VideoTable = ({ videos, users, listings, onRowClick }) => {
    console.log("Listings Array:", listings);

    const itemsPerPage = 7;
    const [currentPage, setCurrentPage] = useState(1);

    const sortedVideos = Array.isArray(videos)
        ? [...videos]
              .filter((v) => v.created_at)
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        : [];

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
        console.log("Video selected: ", video);
        if (onRowClick) {
            onRowClick(video);
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
                                Video Title
                            </th>
                            <th className="p-2 border border-gray-300 w-[150px]">
                                Upload Date
                            </th>
                            <th className="p-2 border border-gray-300 w-[150px]">
                                Host
                            </th>
                            <th className="p-2 border border-gray-300 w-[180px]">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVideos.map((video, index) => {
                            const listing = listings?.find(
                                (listing) => listing.id === video.listing_id
                            );

                            console.log("Checking Listing Match:", {
                                videoListingId: String(video.listing_id),
                                availableListings: listings.map((l) =>
                                    String(l.id)
                                ),
                                matchedListing: listing || "No Match Found",
                            });

                            const host = users?.find(
                                (user) => user.id === listing?.user_id
                            );

                            console.log("Checking Host Match:", {
                                listingUserId: listing?.user_id,
                                availableUsers: users.map((u) => u.id),
                                matchedHost: host,
                            });

                            return (
                                <tr
                                    key={index}
                                    className="border border-gray-300 text-center odd:bg-gray-100 hover:bg-gray-200 cursor-pointer transition duration-200"
                                    onClick={() => handleRowClick(video)}
                                >
                                    <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap">
                                        {listing?.name.length > 20
                                            ? `${listing.name.slice(0, 20)}...`
                                            : listing?.name}
                                    </td>
                                    <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap">
                                        {video.created_at.slice(0, 10)}
                                    </td>
                                    <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap">
                                    <span className="px-3 py-1 text-white font-bold rounded-md bg-red-500 block mx-auto w-[200px] overflow-hidden text-ellipsis">                                            {host
                                                ? `${host.firstname} ${host.lastname}`
                                                : "Unknown"}
                                        </span>
                                    </td>
                                    <td className="p-2 w-[180px]">
                                        <span
                                            className={`px-3 py-1 text-white w-[200px] font-bold block mx-auto rounded-md ${
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
                            );
                        })}
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
