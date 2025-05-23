import React, { useState } from "react";
import { usePage, useForm } from "@inertiajs/react";
import { UserCircle, LogOut, RefreshCw } from "lucide-react";

const PageHeader = ({ breadcrumb = "Content Management / Videos" }) => {
    const { auth, model_has_roles } = usePage().props;
    const user = auth?.user || {};
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { post } = useForm();

    const userRole = model_has_roles?.find(
        (role) => role.model_id === user.id
    )?.role_id;

    const getRoleName = (roleId) => {
        switch (roleId) {
            case 1:
                return "Super Admin";
            case 4:
                return "Content Moderator";
            case 5:
                return "Finance Administrator";
            default:
                return "Admin Account";
        }
    };

    const handleLogout = () => {
        post("/logout", {
            onSuccess: () => {
                window.location.href = "/";
            },
        });
    };

    return (
        <div className="flex justify-between items-center w-full bg-gray-100 px-6 py-4 relative">
            {/* Breadcrumb Section */}
            <h1 className="text-lg font-semibold">{breadcrumb}</h1>

            {/* Page Reloader and User Profile Section */}
            <div className="flex items-center space-x-6">
                {/* Page Reloader */}
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition duration-200"
                >
                    <RefreshCw className="w-5 h-5" />{" "}
                </button>
                {/* User Profile Section */}
                <div className="relative">
                    <div
                        className="flex items-center space-x-3 cursor-pointer select-none 
                        hover:bg-gray-200 transition duration-200 rounded-lg p-2"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <UserCircle className="w-8 h-8 text-gray-600 transition duration-200 hover:text-gray-800" />
                        <div>
                            <p className="text-sm font-semibold select-none transition duration-200 hover:text-gray-800">
                                {user.firstname || "Guest"}
                            </p>
                            <p className="text-xs text-gray-500 select-none transition duration-200 hover:text-gray-700">
                                {getRoleName(userRole)}
                            </p>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-[9.5rem] bg-white shadow-lg rounded-lg border border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
