import React from "react";

const ListingDetailsModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 ">
            <div className="w-3/5 p-8 bg-white rounded shadow-lg h-1/2">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default ListingDetailsModal;
