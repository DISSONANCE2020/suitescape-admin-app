import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import ApprovalConfirmationModal from "./ApprovalConfirmationModal";

const VideoDetails = ({ video, onBack, onStatusUpdate }) => {
    const [status, setStatus] = useState(video?.is_approved ?? null);
    const [violations, setViolations] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);

    const termsOfService = [
        "Copyright Infringement",
        "Misleading Content",
        "Offensive Material",
        "Privacy Violations",
        "Prohibited Activities",
        "Deceptive Advertising",
    ];

    const handleStatusChange = (newStatus) => {
        setPendingStatus(newStatus);
        setModalOpen(true);
    };

    const confirmStatusChange = () => {
        setStatus(pendingStatus);
        setDropdownOpen(false);
        setModalOpen(false);
        if (pendingStatus !== 2) setViolations([]);
        onStatusUpdate({ ...video, is_approved: pendingStatus });
    };

    const toggleViolation = (violation) => {
        setViolations((prev) =>
            prev.includes(violation)
                ? prev.filter((v) => v !== violation)
                : [...prev, violation]
        );
    };

    const getStatusText = (status) => {
        switch (status) {
            case 1:
                return "VIDEO APPROVED";
            case 2:
                return "VIDEO REJECTED";
            case null:
            default:
                return "PENDING APPROVAL";
        }
    };

    return (
        <div className="w-full flex flex-col justify-center min-h-[500px]">
            <div className="w-full flex max-w-5xl">
                {/* Left + Middle Section */}
                <div className="flex w-2/3">
                    {/* Left - Video */}
                    <div className="w-[250px] flex justify-start items-center">
                        <video
                            controls
                            className="w-[250px] h-[450px] object-cover rounded-lg"
                        >
                            <source
                                src={
                                    video?.listing_id && video?.filename
                                        ? `http://127.0.0.1:8001/storage/listings/${video.listing_id}/videos/${video.filename}`
                                        : "http://127.0.0.1:8001/videos/default.mp4"
                                }
                                type="video/mp4"
                            />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Middle - Video Details */}
                    <div className="w-2/3 px-4 space-y-6">
                        <h2 className="text-2xl pb-2 font-bold">
                            {video?.listingName || "Unknown Listing"}
                        </h2>
                        <h3 className="text-lg font-medium text-gray-600">
                            {video?.host || "Unknown Host"}
                        </h3>

                        {/* Status Dropdown */}
                        <div className="relative inline-block">
                            <button
                                className={`px-3 py-1 text-white font-bold rounded-md flex justify-between items-center w-[220px] ${
                                    status === 1
                                        ? "bg-green-500"
                                        : status === 2
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                                }`}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                {getStatusText(status)}
                                <ChevronDown size={16} className="ml-2" />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute mt-2 rounded-lg bg-white p-2 pl-0 z-10">
                                    <button
                                        className="px-3 py-1 mt-2 text-white font-bold rounded-md flex justify-between items-start w-[220px] bg-green-500 hover:bg-green-600"
                                        onClick={() => handleStatusChange(1)}
                                    >
                                        APPROVE VIDEO
                                    </button>
                                    <button
                                        className="px-3 py-1 mt-2 text-white font-bold rounded-md flex justify-between items-start w-[220px] bg-red-500 hover:bg-red-600"
                                        onClick={() => handleStatusChange(2)}
                                    >
                                        REJECT VIDEO
                                    </button>
                                    <button
                                        className="px-3 py-1 mt-2 text-white font-bold rounded-md flex justify-between items-start w-[220px] bg-blue-500 hover:bg-blue-600"
                                        onClick={() => handleStatusChange(null)}
                                    >
                                        REMOVE STATUS
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="text-black font-semibold">
                            Video ID:{" "}
                            <span className="font-normal">
                                {video?.id?.slice(0, 14) || "N/A"}
                            </span>
                        </p>
                        <p className="text-black font-semibold">
                            Upload Date:{" "}
                            <span className="font-normal">
                                {video?.created_at?.slice(0, 10) ||
                                    "Unknown Date"}
                            </span>
                        </p>
                        <p className="text-black font-semibold">
                            Description:{" "}
                            <span className="font-normal">
                                {video?.listingDescription ||
                                    "No description available"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Right - Violations & Back */}
                <div className="w-1/3 px-4 border-l flex flex-col justify-between">
                    <div>
                        <h4 className="text-2xl pb-2 font-bold">
                            Terms Violated
                        </h4>
                        {termsOfService.map((term) => (
                            <label key={term} className="block mt-6">
                                <input
                                    type="checkbox"
                                    checked={violations.includes(term)}
                                    onChange={() => toggleViolation(term)}
                                    className="mr-2"
                                />
                                {term}
                            </label>
                        ))}
                    </div>

                    <button
                        onClick={onBack}
                        className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400 transition self-end"
                    >
                        Back to Table
                    </button>
                </div>
            </div>

            {/* Approval Confirmation Modal */}
            <ApprovalConfirmationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmStatusChange}
                status={pendingStatus}
            />
        </div>
    );
};

export default VideoDetails;
