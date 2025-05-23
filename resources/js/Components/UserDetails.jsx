import { React, useMemo } from "react";
import ProfileImageFallback from "../../assets/images/ProfileImageFallback.jpg";

const UserDetails = ({
    user,
    activeSessions = [],
    userListings = [],
    userBookings = [],
    onBack,
}) => {
    if (!user) return null;

    const roleNames = {
        2: "Host",
        3: "Guest",
    };

    const userSince = user.created_at
        ? new Date(user.created_at).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "N/A";

    const lastActive =
        activeSessions.find((session) => session.user_id === user.id)
            ?.updated_at || "N/A";

    const formattedLastActive =
        lastActive !== "N/A"
            ? new Date(lastActive).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
              })
            : "N/A";

    const ownedListings = useMemo(
        () =>
            userListings
                .filter((listing) => listing.user_id === user.id)
                .map((listing) => listing.name),
        [userListings, user.id]
    );

    const bookingsCount = useMemo(
        () =>
            userBookings.filter((booking) => booking.user_id === user.id)
                .length,
        [userBookings, user.id]
    );

    const cancelledBookingsCount = useMemo(
        () =>
            userBookings.filter(
                (booking) =>
                    booking.user_id === user.id &&
                    booking.status === "cancelled"
            ).length,
        [userBookings, user.id]
    );

    const profileImage = user.profile_image;

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = ProfileImageFallback;
    };

    return (
        <div className="w-full flex flex-col justify-center min-h-[500px]">
            <div className="w-full max-w-5xl flex flex-col md:flex-row">
                {/* Profile Image Section */}
                <div className="w-full md:w-1/3 flex justify-center items-center">
                    <img
                        src={profileImage}
                        loading="lazy"
                        alt="Profile"
                        className="w-full md:w-[250px] h-[250px] md:h-[450px] object-cover rounded-lg"
                        onError={handleImageError}
                    />
                </div>

                {/* User Details Section */}
                <div className="w-full h-[250px] ml-4 md:h-[450px] md:w-2/3 space-y-4">
                    <h2 className="text-2xl font-bold">
                        {user.firstname} {user.lastname}
                    </h2>
                    <h3 className="text-lg font-medium pb-8 text-[#808080]">
                        {user.role_id === 2
                            ? "Host"
                            : user.role_id === 3
                            ? "Guest"
                            : "N/A"}
                    </h3>
                    <p className="font-semibold text-black">
                        Last Active:{" "}
                        <span className="font-normal">
                            {formattedLastActive}
                        </span>
                    </p>
                    <p className="font-semibold text-black">
                        Email:{" "}
                        <span className="font-normal">
                            {user.email || "N/A"}
                        </span>
                    </p>
                    <p className="font-semibold text-black">
                        User Since:{" "}
                        <span className="font-normal">{userSince}</span>
                    </p>
                    <br />
                    <p className="font-semibold text-black">
                        Owned Listings:{" "}
                        <span className="font-normal">
                            {ownedListings.length > 0
                                ? ownedListings.join(", ")
                                : "None"}
                        </span>
                    </p>
                    <p className="font-semibold text-black">
                        No. of Bookings:{" "}
                        <span className="font-normal">
                            {bookingsCount || "0"}
                        </span>
                    </p>
                    <p className="font-semibold text-red-600">
                        <span className="font-semibold text-red-600">
                            No. of Cancelled Bookings:{" "}
                        </span>
                        <span className="font-normal">
                            {cancelledBookingsCount || "0"}
                        </span>
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
