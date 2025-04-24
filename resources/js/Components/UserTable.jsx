import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";

const UserTable = ({ user, onRowClick, currentPage, setCurrentPage }) => {
    const [filteredUsers, setFilteredUsers] = useState([]);
    const itemsPerPage = 8;

    const roleNames = {
        1: "Super Admin",
        2: "Host",
        3: "Guest",
        4: "Content Moderator",
        5: "Finance Manager",
    };

    useEffect(() => {
        if (!Array.isArray(user)) return;

        let filteredAndSortedUsers = [...user]
            .filter(user => {
                const roleId = user.role_id ?? 3; // If role_id is null, treat as Guest (3)
                return roleId === 2 || roleId === 3;
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setFilteredUsers(filteredAndSortedUsers);
    }, [user]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentUsers = filteredUsers.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <div className="flex flex-col h-[67.5vh] w-full">
            <div className="flex-grow overflow-x-auto">
                <table className="w-full table-fixed border border-[#D1D5DB] bg-transparent">
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
                        {currentUsers.map((user, index) => {
                            const formattedDate = user.created_at
                                ? new Date(user.created_at).toLocaleString(
                                      "en-US",
                                      {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                      }
                                  )
                                : "N/A";
                            const time = user.created_at
                                ? user.created_at.slice(11, 19)
                                : "";

                            return (
                                <tr
                                    key={user.id || index}
                                    className="h-12 border border-[#D1D5DB] text-center odd:bg-transparent hover:bg-[#E5E7EB] cursor-pointer transition duration-200"
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
                                        {formattedDate} at {time}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default UserTable;
