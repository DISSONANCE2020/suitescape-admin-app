import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

const HeaderBar = ({ title, onSortChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSortSelection = (sortType) => {
        onSortChange(sortType);
        setIsDropdownOpen(false); // Close dropdown after selection
    };

    return (
        <div className="flex pt-2 pb-4 justify-between items-center border-b border-gray-300 relative">
            <h2 className="flex text-xl font-semibold">{title}</h2>
            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2 rounded-md bg-white hover:bg-gray-200 transition flex items-center gap-2"
                >
                    <span>Sort By:</span>
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {[
                            "ALL",
                            "VIDEO APPROVED",
                            "VIDEO REJECTED",
                            "PENDING APPROVAL",
                        ].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => handleSortSelection(filter)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeaderBar;
