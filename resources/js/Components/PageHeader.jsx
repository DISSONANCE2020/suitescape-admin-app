import React from "react";
import { UserCircle } from "lucide-react";
import { usePage } from "@inertiajs/react";

const PageHeader = ({ breadcrumb = "Content Management / Videos" }) => {
    const { auth } = usePage().props; // Get the auth user data
    const user = auth?.user || {}; // Default to an empty object if user is undefined

    return (
        <div className="flex justify-between items-center w-full bg-gray-100 p-6">
            {/* Breadcrumb Section */}
            <h1 className="text-lg font-semibold">{breadcrumb}</h1>

            {/* User Profile Section */}
            <div className="flex items-center space-x-3">
                <UserCircle className="w-8 h-8 text-gray-600" />
                <div>
                    <p className="text-sm font-semibold">
                        {user.firstname || "Guest"}{" "}
                        {/* Fallback to 'Guest' if not logged in */}
                    </p>
                    <p className="text-xs text-gray-500">Admin account</p>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
