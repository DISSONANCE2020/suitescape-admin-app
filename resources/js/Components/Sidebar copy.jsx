import React from "react";
import { usePage } from "@inertiajs/react";
import logo from "../../assets/images/logo.png";

const Sidebar = () => {
    const { url } = usePage().props;
    const { auth, model_has_roles } = usePage().props;
    const user = auth?.user || {};
    const userRole = model_has_roles?.find(
        (role) => role.model_id === user.id
    )?.role_id;

    let navLinks = [];
    if (userRole === 1) {
        // Super Admin
        navLinks = [
            { label: "User Management", href: "/super-admin" },
            { label: "Finance Management", href: "/finance" },
            { label: "Content Moderation", href: "/content-moderator" },
        ];
    } else if (userRole === 5) {
        // Finance Administrator
        navLinks = [{ label: "Finance Management", href: "/finance" }];
    } else if (userRole === 4) {
        // Content Moderator
        navLinks = [
            { label: "Content Moderation", href: "/content-moderator" },
        ];
    }

    return (
        <div className="w-64 bg-[#ffffff] border-r border-[#D1D5DB] min-h-screen p-4 flex flex-col">
            {/* Logo */}
            <img src={logo} alt="Logo" className="w-48 mx-auto" />

            {/* Navigation Menu */}
            <div className="flex-grow">
                <h2 className="text-sm font-semibold text-[#9CA3AF] uppercase mb-2">
                    Menu
                </h2>
                <nav>
                    <ul>
                        {navLinks.map((link) => (
                            <li key={link.label} className="mb-2">
                                <a
                                    href={link.href}
                                    className={`block rounded-md px-2 py-1 hover:bg-[#F3F4F6] ${
                                        url.startsWith(link.href)
                                            ? "text-[#1F2937] font-semibold bg-[#E5E7EB]"
                                            : "text-[#1F2937] font-normal bg-[#ffffff]"
                                    }`}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Separator and Other Section */}
            <div>
                <hr className="my-4 border-[#D1D5DB]" />
                <h2 className="text-sm font-semibold text-[#9CA3AF] uppercase mb-2">
                    Other
                </h2>
                <ul>
                    <li className="mb-2">
                        <a
                            href="#"
                            className="block text-[#1F2937] hover:bg-[#F3F4F6] rounded-md px-2 py-1"
                        >
                            Help
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block text-[#1F2937] hover:bg-[#F3F4F6] rounded-md px-2 py-1"
                        >
                            Settings
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
