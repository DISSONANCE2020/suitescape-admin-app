import React from "react";

const ContentCard = ({ children }) => {
    return (
        <div className="w-full h-[86vh] bg-white border border-gray-300 p-6 pt-2 rounded-lg">
            <div className="mt-4">{children}</div>
        </div>
    );
};

export default ContentCard;
