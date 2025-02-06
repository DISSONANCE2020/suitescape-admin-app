import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const VideoDetails = ({ video, onBack }) => {
    const [status, setStatus] = useState("pending");
    const [violations, setViolations] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const termsOfService = [
        "Copyright Infringement",
        "Misleading Content",
        "Offensive Material",
        "Privacy Violations",
        "Prohibited Activities",
        "Deceptive Advertising",
    ];

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        setDropdownOpen(false);
        if (newStatus !== "rejected") {
            setViolations([]);
        }
    };

    const toggleViolation = (violation) => {
        setViolations((prev) =>
            prev.includes(violation)
                ? prev.filter((v) => v !== violation)
                : [...prev, violation]
        );
    };

    return (
        <div className="w-full flex border p-4">
            {/* Left - Portrait Video */}
            <div className="w-1/3 flex justify-start items-center">
                <video
                    controls
                    className="w-[250px] h-[450px] object-cover rounded-lg shadow-md"
                >
                    <source src="/path-to-your-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Middle - Video Details */}
            <div className="w-1/3 px-4 border-l">
                <h2 className="text-2xl font-bold">{video.filename}</h2>

                {/* Status Dropdown */}
                <div className="relative mt-2 inline-block">
                    <button
                        className={`px-3 py-1 text-sm rounded-full flex items-center gap-2 ${
                            status === "accepted"
                                ? "bg-green-500 text-white"
                                : status === "rejected"
                                ? "bg-red-500 text-white"
                                : "bg-blue-500 text-white"
                        }`}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {status === "accepted"
                            ? "Accepted"
                            : status === "rejected"
                            ? "Rejected"
                            : "APPROVAL PENDING"}
                        <ChevronDown size={16} />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute mt-2 w-40 bg-white shadow-lg rounded-lg border z-10">
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-200 text-green-600"
                                onClick={() => handleStatusChange("accepted")}
                            >
                                Accept
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-200 text-red-600"
                                onClick={() => handleStatusChange("rejected")}
                            >
                                Reject
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-200 text-blue-600"
                                onClick={() => handleStatusChange("pending")}
                            >
                                Approval Pending
                            </button>
                        </div>
                    )}
                </div>

                <p className="mt-4 text-gray-600 font-semibold">
                    Video ID: {video.id}
                </p>
                <p className="text-gray-600 font-semibold">
                    Upload Date: {video.created_at}
                </p>

                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="mt-4 px-5 py-2 bg-gray-300 text-gray-500 text-lg rounded-lg"
                >
                    Back to Table
                </button>
            </div>

            {/* Right - TOS Violations */}
            <div className="w-1/3 px-4 border-l">
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                    Terms of Service Violated
                </h3>
                {termsOfService.map((term) => (
                    <label
                        key={term}
                        className="flex items-center mt-2 text-gray-700 text-lg"
                    >
                        <input
                            type="checkbox"
                            className="w-5 h-5 mr-3 accent-[#000]"
                            disabled={status !== "rejected"}
                            checked={violations.includes(term)}
                            onChange={() => toggleViolation(term)}
                        />
                        {term}
                    </label>
                ))}

                {/* Save Button */}
                <button
                    className="mt-4 px-5 py-2 bg-gray-300 text-gray-500 text-lg rounded-lg disabled:opacity-50"
                    disabled={status !== "rejected" || violations.length === 0}
                >
                    SAVE
                </button>
            </div>
        </div>
    );
};

export default VideoDetails;
