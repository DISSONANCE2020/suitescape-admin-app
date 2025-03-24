import React from "react";

const FinanceListingDetailsModal = ({ listing, users, onClose }) => {
    if (!listing) return null;

    const host = users?.find((h) => h.id === listing?.user_id);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-2xl ">
                <h2 className="text-3xl font-semibold mb-6">Listing Details</h2>
                {/* Description Section */}
                <p className="text-xl">{listing.description || "N/A"}</p>

                <div className="mt-4 mb-6 border border-gray-300"></div>

                {/* Single Row Layout */}
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex">
                        <span className="w-60 font-semibold text-xl">
                            Listing Name:
                        </span>
                        <span className="text-xl capitalize">
                            {listing.name || "N/A"}
                        </span>
                    </div>

                    <div className="flex">
                        <span className="w-60 font-semibold text-xl">
                            Facility Type:
                        </span>
                        <span className="text-xl capitalize">
                            {listing.facility_type || "N/A"}
                        </span>
                    </div>

                    <div className="flex">
                        <span className="w-60 font-semibold text-xl">
                            Location:
                        </span>
                        <span className="text-xl capitalize break-words max-w-[350px]">
                            {listing.location || "N/A"}
                        </span>
                    </div>

                    <div className="flex">
                        <span className="w-60 font-semibold text-xl">
                            Adult Capacity:
                        </span>
                        <span className="text-xl">
                            {listing.adult_capacity || "N/A"}
                        </span>
                    </div>

                    <div className="flex">
                        <span className="w-60 font-semibold text-xl">
                            Child Capacity:
                        </span>
                        <span className="text-xl">
                            {listing.child_capacity || "N/A"}
                        </span>
                    </div>

                    <div className="flex">
                        <span className="w-60 font-semibold text-xl">
                            Host Name:
                        </span>
                        <span className="text-xl capitalize">
                            {host
                                ? `${host.firstname} ${host.lastname}`
                                : "Unknown"}
                        </span>
                    </div>

                    <div className="flex">
                        <span className="w-60 font-semibold text-xl">
                            Host Email:
                        </span>
                        <span className="text-xl">{host?.email || "N/A"}</span>
                    </div>

                    <div className="flex">
                        <span className="w-60 font-semibold text-xl">
                            Check-in & Check-out:
                        </span>
                        <span className="text-xl">
                            {listing.check_in_time && listing.check_out_time ? (
                                <>
                                    {new Date(
                                        `1970-01-01T${listing.check_in_time}`
                                    ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}{" "}
                                    -{" "}
                                    {new Date(
                                        `1970-01-01T${listing.check_out_time}`
                                    ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </>
                            ) : (
                                "N/A"
                            )}
                        </span>
                    </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 font-medium text-black bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-200 drop-shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinanceListingDetailsModal;
