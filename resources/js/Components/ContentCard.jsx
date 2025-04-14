import React from "react";

const ContentCard = ({ children }) => {
    return (
        <div className="w-full h-screen p-6 pt-2 bg-white border border-gray-300 rounded-lg">
            <div className="mt-4">{children}</div>
        </div>
    );
};

export default ContentCard;
