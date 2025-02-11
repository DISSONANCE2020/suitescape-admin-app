import React from "react";

const ApprovalConfirmationModal = ({ isOpen, onClose, onConfirm, status }) => {
    if (!isOpen) return null;

    const getStatusMessage = () => {
        switch (status) {
            case 1:
                return "Are you sure you want to approve this video?";
            case 2:
                return "Are you sure you want to reject this video?";
            case null:
                return "Are you sure you want to remove the video status?";
            default:
                return "";
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <h2 className="text-xl font-bold mb-4">Confirmation</h2>
                <p className="mb-6">{getStatusMessage()}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                        onClick={onClose}
                    >
                        No
                    </button>
                    <button
                        className={`py-2 px-4 text-white rounded-md transition ${
                            status === 1
                                ? "bg-green-500 hover:bg-green-600"
                                : status === 2
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalConfirmationModal;
