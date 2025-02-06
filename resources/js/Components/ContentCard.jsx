import React from "react";
import HeaderBar from "./HeaderBar";

const ContentCard = ({ title, children }) => {
    return (
        <div className="w-full bg-white border border-gray-300 p-6 pt-4 rounded-lg">
            <HeaderBar title={title} />
            <div className="mt-4">{children}</div>
        </div>
    );
};

export default ContentCard;
