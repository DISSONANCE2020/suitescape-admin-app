import React, { useState, useEffect } from "react";

const VideoTable = ({
    videos,
    users,
    listings,
    onRowClick,
    sortFilter,
    currentPage,
    setCurrentPage,
}) => {
    const [filteredVideos, setFilteredVideos] = useState([]);
    const itemsPerPage = 7;

    useEffect(() => {
        if (!Array.isArray(videos)) return;

        let filtered = [...videos];

        switch (sortFilter) {
            case "VIDEO APPROVED":
                filtered = filtered.filter((video) => video.is_approved === 1);
                break;
            case "VIDEO REJECTED":
                filtered = filtered.filter((video) => video.is_approved === 0);
                break;
            case "PENDING APPROVAL":
                filtered = filtered.filter(
                    (video) => video.is_approved === null
                );
                break;
            default:
                break;
        }

        filtered.sort(
            (a, b) =>
                new Date(b.updated_at || b.created_at) -
                new Date(a.updated_at || a.created_at)
        );

        setFilteredVideos(filtered);
    }, [videos, sortFilter]);

    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentVideos = filteredVideos.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <div className="rounded-lg pt-2 h-[67.5vh] flex flex-col w-full max-w-full">
            <div className="overflow-x-auto w-full max-w-full">
                <table className="w-full table-fixed border border-[#D1D5DB] min-w-[600px]">
                    <thead>
                        <tr className="text-center">
                            <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                Video Title
                            </th>
                            <th className="p-2 border border-[#D1D5DB] w-[150px]">
                                Upload Date
                            </th>
                            <th className="p-2 border border-[#D1D5DB] w-[150px] hidden md:table-cell">
                                Host
                            </th>
                            <th className="p-2 border border-[#D1D5DB] w-[180px] hidden md:table-cell">
                                Status
                            </th>
                            <th className="p-2 border border-[#D1D5DB] w-[150px] hidden md:table-cell">
                                Moderated By
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVideos.map((video, index) => {
                            const listing = listings?.find(
                                (listing) => listing.id === video.listing_id
                            );

                            const host = users?.find(
                                (user) => user.id === listing?.user_id
                            );

                            const moderator = users?.find(
                                (user) => user.id === video.moderated_by
                            );

                            const formattedDate = video.created_at
                                ? new Date(video.created_at).toLocaleString(
                                      "en-US",
                                      {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                      }
                                  )
                                : "N/A";

                            const time = video.created_at
                                ? video.created_at.slice(11, 19)
                                : "";

                            return (
                                <tr
                                    key={video.id || index}
                                    className="border border-[#D1D5DB] text-center odd:bg-[#F3F4F6] hover:bg-[#E5E7EB] cursor-pointer transition duration-200"
                                    onClick={() => onRowClick(video)}
                                >
                                    <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap">
                                        {listing?.name?.length > 20
                                            ? `${listing.name.slice(0, 20)}...`
                                            : listing?.name}
                                    </td>
                                    <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap">
                                        {formattedDate} at {time}
                                    </td>

                                    <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap hidden md:table-cell">
                                        <span className="px-3 py-1 text-white font-bold rounded-md bg-[#EF4444] block mx-auto w-[200px] overflow-hidden text-ellipsis">
                                            {host
                                                ? `${host.firstname} ${host.lastname}`
                                                : "Unknown"}
                                        </span>
                                    </td>
                                    <td className="p-2 w-[180px] hidden md:table-cell">
                                        <span
                                            className={`px-3 py-1 text-white w-[200px] font-bold block mx-auto rounded-md ${
                                                video.is_approved === null
                                                    ? "bg-[#3B82F6]"
                                                    : video.is_approved === 1
                                                    ? "bg-[#10B981]"
                                                    : "bg-[#EF4444]"
                                            }`}
                                        >
                                            {video.is_approved === null
                                                ? "PENDING APPROVAL"
                                                : video.is_approved === 1
                                                ? "VIDEO APPROVED"
                                                : "VIDEO REJECTED"}
                                        </span>
                                    </td>
                                    <td className="p-2 w-[150px] overflow-hidden whitespace-nowrap hidden md:table-cell">
                                        {video.is_approved === null
                                            ? "Pending"
                                            : moderator
                                            ? `${moderator.firstname} ${moderator.lastname}`
                                            : "Unknown"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-auto flex justify-between items-center pt-4 px-2">
                <button
                    className="px-4 py-2 bg-[#E5E7EB] rounded-lg disabled:opacity-50"
                    onClick={() =>
                        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                    }
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <span className="text-lg font-medium">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    className="px-4 py-2 bg-[#E5E7EB] rounded-lg disabled:opacity-50"
                    onClick={() =>
                        setCurrentPage((prev) =>
                            prev < totalPages ? prev + 1 : prev
                        )
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
