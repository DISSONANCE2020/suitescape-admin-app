import React from "react";

const Sidebar = () => {
    return (
        <div className="w-64 bg-white border-r border-gray-300 min-h-screen p-4 flex flex-col">
            {/* Placeholder Logo */}
            <div className="bg-red-500 h-16 w-full mb-4 flex items-center justify-center">
                <span className="text-white font-bold">LOGO</span>
            </div>

            {/* Navigation Menu */}
            <div className="flex-grow">
                <h2 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                    Menu
                </h2>
                <nav>
                    <ul>
                        <li className="mb-2">
                            <a
                                href="#"
                                className="block text-gray-800 hover:bg-gray-100 rounded-md px-2 py-1"
                            >
                                Financial Administration
                            </a>
                        </li>
                        <li className="mb-2">
                            <a
                                href="#"
                                className="block text-gray-800 font-semibold bg-gray-200 rounded-md px-2 py-1"
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
                <h2 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                    Other
                </h2>
                <ul>
                    <li className="mb-2">
                        <a
                            href="#"
                            className="block text-gray-800 hover:bg-gray-100 rounded-md px-2 py-1"
                        >
                            Help
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block text-gray-800 hover:bg-gray-100 rounded-md px-2 py-1"
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
