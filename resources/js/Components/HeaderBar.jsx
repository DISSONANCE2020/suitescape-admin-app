import React from "react";
import { SlidersHorizontal } from "lucide-react"; // Uses lucide-react for the icon

const HeaderBar = ({ title }) => {
    return (
        <div className="flex justify-between items-center border-b border-gray-300">
            <h2 className="flex text-xl font-semibold">{title}</h2>
            <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    );
};

export default HeaderBar;