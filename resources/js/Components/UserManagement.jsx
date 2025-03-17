import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import UserTable from "./UserTable";
import UserDetails from "./UserDetails";

const UserManagement = () => {
    const { users } = usePage().props;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sortedUsers, setSortedUsers] = useState([]);
    const [sortBy, setSortBy] = useState("ALL");

    useEffect(() => {
        if (!Array.isArray(users)) return;
        // Sort users by creation date (descending)
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
            <div className="flex justify-between items-center mb-4 border-b border-[#D1D5DB] pb-4">
                <div>
                    <h2 className="text-lg font-semibold">Users</h2>
                    <p className="text-sm text-[#808080]">
                        {filteredUsers.length} Total Users
                    </p>
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 w-[220px] border border-[#D1D5DB] rounded-md"
                >
                    <option value="ALL">All</option>
                    <option value="1">Super Admins</option>
                    <option value="2">Hosts</option>
                    <option value="3">Guests</option>
                    <option value="4">Content Moderators</option>
                    <option value="5">Finance Managers</option>
                </select>
            </div>

            {selectedUser ? (
                <UserDetails
                    user={selectedUser}
                    onBack={() => setSelectedUser(null)}
                />
            ) : (
                <div className="flex-grow">
                    <UserTable
                        users={filteredUsers}
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
