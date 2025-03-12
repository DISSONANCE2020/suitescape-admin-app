import React from "react";
import logo from "../../assets/images/logo.png";
import { usePage } from "@inertiajs/react";

const Sidebar = () => {
    const { url } = usePage();
    return (
        <div className="flex flex-col w-64 min-h-screen p-4 bg-white border-r border-gray-300">
            {/* Placeholder Logo */}
            <img src={logo} alt="Logo" className="w-48 mx-auto" />
            {/* Navigation Menu */}
            <div className="flex-grow">
                <h2 className="mb-2 text-sm font-semibold text-gray-400 uppercase">
                    Menu
                </h2>
                <nav>
                    <ul>
                        <li className="mb-2">
                            <a
                                href="/finance"
                                className={`block px-2 py-2 text-gray-800 rounded-md ${
                                    url === "/finance" ? "bg-gray-200" : ""
                                }`}
                            >
                                Finance Management
                            </a>
                        </li>
                        <li className="mb-2">
                            <a
                                href="/content-moderator"
                                className={`block px-2 py-2 text-gray-800 rounded-md ${
                                    url === "/content-moderator"
                                        ? "bg-gray-200"
                                        : ""
                                }`}
                            >
                                Content Moderation
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Separator and Other Section */}
            <div>
                <hr className="my-4 border-gray-300" />
                <h2 className="mb-2 text-sm font-semibold text-gray-400 uppercase">
                    Other
                </h2>
                <ul>
                    <li className="mb-2">
                        <a
                            href="#"
                            className="block px-2 py-1 text-gray-800 rounded-md hover:bg-gray-100"
                        >
                            Help
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block px-2 py-1 text-gray-800 rounded-md hover:bg-gray-100"
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
