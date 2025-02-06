import React from "react";
import { UserCircle } from "lucide-react"; // Placeholder icon

const PageHeader = ({ breadcrumb, user }) => {
  return (
    <div className="flex justify-between items-center w-full bg-gray-100 p-6">
      {/* Breadcrumb Section */}
      <h1 className="text-lg font-semibold">
        {breadcrumb}
      </h1>

      {/* User Profile Section */}
      <div className="flex items-center space-x-3">
        <UserCircle className="w-8 h-8 text-gray-600" />
        <div>
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
      </div>
    </div>
  );
};

// Placeholder Props (Easy to make dynamic later)
PageHeader.defaultProps = {
  breadcrumb: "Content Management / Videos",
  user: {
    name: "Andrew",
    role: "Admin account",
  },
};

export default PageHeader;
