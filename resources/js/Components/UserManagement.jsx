import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import UserTable from "./UserTable";
import UserDetails from "./UserDetails";

const UserManagement = () => {
    const { users, activeSessions, listings, bookings } = usePage().props;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sortedUsers, setSortedUsers] = useState([]);
    const [sortBy, setSortBy] = useState("ALL");

    useEffect(() => {
        if (!Array.isArray(users)) return;
        let sorted = [...users].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setSortedUsers(sorted);
    }, [users]);

    const handleRowClick = (user) => {
        setSelectedUser(user);
    };

    const filteredUsers = sortedUsers.filter((user) => {
        if (sortBy === "ALL") return true;
        if (sortBy === "3") return user.role_id === 3 || user.role_id === null;
        return user.role_id === parseInt(sortBy);
    });

    return (
        <div className="flex flex-col h-full">
            {/* Header with current user count and sorting dropdown */}
            <div className="flex h-[58px] justify-between items-center mb-4 border-b border-[#D1D5DB] pb-4">
                <div>
                    <h2 className="text-lg font-semibold">Users</h2>
                </div>
                <p className="text-sm text-[#808080]">
                    {filteredUsers.length} Total Users
                </p>
            </div>

            {selectedUser ? (
                <UserDetails
                    user={selectedUser}
                    activeSessions={activeSessions}
                    userListings={listings}
                    userBookings={bookings}
                    onBack={() => setSelectedUser(null)}
                />
            ) : (
                <div className="flex-grow">
                    <UserTable
                        user={filteredUsers}
                        onRowClick={handleRowClick}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default UserManagement;
