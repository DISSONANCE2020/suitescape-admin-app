import React, { useState, useEffect } from "react";

const UserTable = ({ users, onRowClick, currentPage, setCurrentPage }) => {
    const [filteredUsers, setFilteredUsers] = useState([]);
    const itemsPerPage = 9;

    const roleNames = {
        1: "Super Admin",
        2: "Host",
        3: "Guest",
        4: "Content Moderator",
        5: "Finance Manager",
    };

    useEffect(() => {
        if (!Array.isArray(users)) return;

        let filteredAndSortedUsers = [...users]
            .filter(user => {
                const roleId = user.role_id ?? 3; // If role_id is null, treat as Guest (3)
                return roleId === 2 || roleId === 3;
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setFilteredUsers(filteredAndSortedUsers);
    }, [users]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentUsers = filteredUsers.slice(
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
                                Name
                            </th>
                            <th className="p-2 border border-[#D1D5DB] w-[250px]">
                                Email
                            </th>
                            <th className="p-2 border border-[#D1D5DB] w-[200px]">
                                User Since
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers
                            // .filter(
                            //     (user) =>
                            //         user.role_id === 2 || user.role_id === 3
                            // )
                            .map((user, index) => (
                                <tr
                                    key={user.id || index}
                                    className="border border-[#D1D5DB] text-center odd:bg-[#F3F4F6] hover:bg-[#E5E7EB] cursor-pointer transition duration-200"
                                    onClick={() =>
                                        onRowClick && onRowClick(user)
                                    }
                                >
                                    <td className="p-2 overflow-hidden whitespace-nowrap">
                                        {`${user.firstname} ${user.lastname}`}
                                    </td>
                                    <td className="p-2 overflow-hidden whitespace-nowrap">
                                        {user.email}
                                    </td>
                                    <td className="p-2 overflow-hidden whitespace-nowrap">
                                        {user.created_at.slice(0, 10)} at{" "}
                                        {user.created_at.slice(11, 19)}{" "}
                                    </td>
                                </tr>
                            ))}
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

export default UserTable;
