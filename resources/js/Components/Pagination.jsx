import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center items-center px-4 mt-auto bottom-0 bg-white">
            <button
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <span className="mx-4 text-lg font-medium">
                Page {currentPage} of {totalPages}
            </span>
            <button
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
