import React from "react";

const ContentCard = ({ children }) => {
    return (
        <div className="w-full h-[85vh] bg-white border border-gray-300 p-5 pt-2 rounded-lg">
            <div className="mt-4">{children}</div>
        </div>
    );
};

export default ContentCard;
