import React from "react";
import logo from "../../assets/images/logo.png";

const Sidebar = () => {
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
                                href="/financial-administration"
                                className="block px-2 py-1 text-gray-800 rounded-md hover:bg-gray-100"
                            >
                                Financial Administration
                            </a>
                        </li>
                        <li className="mb-2">
                            <a
                                href="/content-moderator"
                                className="block px-2 py-1 font-semibold text-gray-800 bg-gray-200 rounded-md"
                            >
                                Content Management
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
