import React from "react";

const UserDetails = ({ user, activeSessions = [], userListings = [], userBookings = [], onBack }) => {
    const roleNames = {
        2: "Host",
        3: "Guest",
    };

const userSessions = activeSessions.find(session => session.user_id === user.id);

const userSince = user.created_at ? new Date(user.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
}) : "N/A";

const lastActive = userSessions ? userSessions.updated_at : "N/A";

const formattedLastActive = lastActive !== "N/A" ? new Date(lastActive).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
}) : "N/A";

const listingsCount = userListings.filter(listing => listing.user_id === user.id).length;

const bookingsCount = userBookings.filter(booking => booking.user_id === user.id).length;

    return (
        <div className="w-full flex flex-col justify-center min-h-[500px]">
            <div className="w-full max-w-5xl flex flex-col md:flex-row">
                {/* User Details Section */}
                <div className="w-full h-[250px] md:h-[450px] md:w-2/3 space-y-4">
                    <h2 className="text-2xl font-bold">
                        {user.firstname} {user.lastname}
                    </h2>
                    <h3 className="text-lg font-medium pb-8 text-[#808080]">
                        {roleNames[user.role_id] || "Guest"}
                    </h3>
                    <p className="font-semibold text-black">
                        Last Active: <span className="font-normal">{formattedLastActive}</span>
                    </p>
                    <p className="font-semibold text-black">
                        Email:{" "}
                        <span className="font-normal">
                            {user.email || "N/A"}
                        </span>
                    </p>
                    <p className="font-semibold text-black">
                        User Since:{" "}
                        <span className="font-normal">
                            {userSince}
                        </span>
                    </p>
                    <br/>
                    <p className="font-semibold text-black">
                        No. of Listings:{" "}
                        <span className="font-normal">{listingsCount || "0"}</span>
                    </p>
                    <p className="font-semibold text-black">
                        No. of Bookings:{" "}
                        <span className="font-normal">{bookingsCount || "0"}</span>
                    </p>
                </div>

                {/* Action Button Section */}
                <div className="w-full md:w-1/3 px-4 mt-4 md:mt-0 md:ml-8">
                    <div className="flex justify-end">
                        <button
                            onClick={onBack}
                            className="py-2 px-4 fixed bottom-20 bg-[#D1D5DB] rounded-md hover:bg-[#9CA3AF] transition"
                        >
                            Back to Table
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;