import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import ApprovalConfirmationModal from "./ApprovalConfirmationModal";

const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a?.length !== b?.length) return false;
    return a.every((val, i) => val === b[i]);
};

const VideoDetails = ({ video, onBack, onStatusUpdate, onViolationsSave }) => {
    const [status, setStatus] = useState(video?.is_approved ?? null);
    const [violations, setViolations] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [initialViolations, setInitialViolations] = useState([]);

    const termsOfService = useMemo(
        () => [
            "Copyright Infringement",
            "Misleading Content",
            "Offensive Material",
            "Privacy Violations",
            "Prohibited Activities",
            "Deceptive Advertising",
        ],
        []
    );

    const handleStatusChange = (newStatus) => {
        setPendingStatus(newStatus);
        setModalOpen(true);
        setDropdownOpen(false);
    };

    const confirmStatusChange = () => {
        const newViolations = pendingStatus === 2 ? violations : [];
        setStatus(pendingStatus);
        setModalOpen(false);

        onStatusUpdate({
            ...video,
            is_approved: pendingStatus,
            violations: newViolations.map((t) => termsOfService.indexOf(t) + 1),
        });
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

    const handleSaveViolations = () => {
        if (onViolationsSave) {
            const violationIds = violations.map(
                (term) => termsOfService.indexOf(term) + 1
            );
            onViolationsSave({ ...video, violations: violationIds });
        }
    };

    const isEditableViolations = status === 2;

    useEffect(() => {
        console.log("Video violation IDs:", video?.violations);
        if (video?.violations && video.violations.length > 0) {
            const violationIds = video.violations.map((v) => v.id || v);
            const violationLabels = violationIds.map(
                (id) => termsOfService[id - 1]
            );

            setViolations(violationLabels);
            setInitialViolations(violationIds);
        } else {
            setViolations([]);
            setInitialViolations([]);
        }
    }, [video, termsOfService]);

    const currentViolationIds = violations.map(
        (term) => termsOfService.indexOf(term) + 1
    );

    return (
        <div className="w-full flex flex-col justify-center min-h-[500px]">
            <div className="w-full flex max-w-5xl flex-col md:flex-row">
                {/* Left + Middle Section */}
                <div className="flex w-full md:w-2/3">
                    {/* Left - Video */}
                    <div className="w-full md:w-[250px] flex justify-center md:justify-start items-center">
                        <video
                            controls
                            className="w-full md:w-[250px] h-[250px] md:h-[450px] object-cover rounded-lg"
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
                    <div className="w-full md:w-2/3 px-4 space-y-4">
                        <h2 className="text-2xl font-bold">
                            {video?.listingName || "Unknown Listing"}
                        </h2>
                        <h3 className="text-lg font-medium pb-8 text-[#808080]">
                            {video?.host || "Unknown Host"}
                        </h3>

                        {/* Status Dropdown */}
                        <div className="relative inline-block">
                            <button
                                className={`px-3 py-1 text-white font-bold rounded-md flex justify-between items-center w-full md:w-[220px] ${
                                    status === 1
                                        ? "bg-[#10B981]"
                                        : status === 2
                                        ? "bg-[#EF4444]"
                                        : "bg-[#3B82F6]"
                                }`}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                {getStatusText(status)}
                                <ChevronDown size={16} className="ml-2" />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute mt-2 rounded-lg bg-white p-2 pl-0 z-10 w-full md:w-[220px]">
                                    <button
                                        className="px-3 py-1 mt-2 text-white font-bold rounded-md flex justify-between items-start w-full bg-[#10B981] hover:bg-[#059669]"
                                        onClick={() => handleStatusChange(1)}
                                    >
                                        APPROVE VIDEO
                                    </button>
                                    <button
                                        className="px-3 py-1 mt-2 text-white font-bold rounded-md flex justify-between items-start w-full bg-[#EF4444] hover:bg-[#DC2626]"
                                        onClick={() => handleStatusChange(2)}
                                    >
                                        REJECT VIDEO
                                    </button>
                                    <button
                                        className="px-3 py-1 mt-2 text-white font-bold rounded-md flex justify-between items-start w-full bg-[#3B82F6] hover:bg-[#2563EB]"
                                        onClick={() => handleStatusChange(null)}
                                    >
                                        REMOVE STATUS
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="font-semibold text-black">
                            Video ID:{" "}
                            <span className="font-normal">
                                {video?.id?.slice(0, 14) || "N/A"}
                            </span>
                        </p>
                        <p className="font-semibold text-black">
                            Upload Date:{" "}
                            <span className="font-normal">
                                {video?.created_at?.slice(0, 10) ||
                                    "Unknown Date"}
                            </span>
                        </p>
                        <p className="font-semibold text-black">
                            Description:{" "}
                            <span className="font-normal">
                                {video?.listingDescription ||
                                    "No description available"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Violations Section */}
                <div className="w-full md:w-1/3 px-4 border-t md:border-t-0 md:border-l flex flex-col justify-between mt-4 md:mt-0 md:ml-8">
                    <div>
                        <h4 className="text-2xl font-bold">Terms Violated</h4>
                        {termsOfService.map((term) => (
                            <label
                                key={term}
                                className={`block mt-6 ${
                                    !isEditableViolations ? "opacity-70" : ""
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={violations.includes(term)}
                                    onChange={() => toggleViolation(term)}
                                    disabled={!isEditableViolations}
                                    className="mr-2"
                                />
                                {term}
                            </label>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end mt-4 md:mt-0">
                        <button
                            onClick={handleSaveViolations}
                            disabled={
                                !isEditableViolations ||
                                arraysEqual(
                                    currentViolationIds,
                                    initialViolations
                                )
                            }
                            className="py-2 px-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Violations
                        </button>
                        <button
                            onClick={onBack}
                            className="py-2 px-4 ml-2 bg-[#D1D5DB] rounded-md hover:bg-[#9CA3AF] transition"
                        >
                            Back to Table
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
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
