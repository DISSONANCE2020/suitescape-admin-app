import React from "react";

const FinanceListingDetailsModal = ({ listing, onClose }) => {
    if (!listing) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-lg w-full">
                <h2 className="text-2xl font-semibold mb-4">Listing Details</h2>
                <p><strong>ID:</strong> {listing.id}</p>
                <p><strong>Name:</strong> {listing.name}</p>
                <p><strong>Facility Type:</strong> {listing.facility_type}</p>
                {/* Add more listing details as needed */}
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default FinanceListingDetailsModal;
