import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import PageHeader from "../Components/PageHeader"; // You can include this if you want a page header
import ContentCard from "../Components/ContentCard";
// Import additional components like ContentCard if needed

const FinancialAdministration = () => {
    const [activeTab, setActiveTab] = useState("payouts");

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar component */}
            <Sidebar />

            <div className="flex-1 pb-2 pl-6 pr-6">
                {/* Page header, you can customize it with breadcrumb and user info */}
                <PageHeader
                    breadcrumb="Finance Administration / Payouts"
                    user={{ name: "Andrew", role: "Admin account" }}
                />

                {/* Main content area */}
                <ContentCard>
                    <div className="h-5 grid-flow-col gap-1 mb-10 ">
                        <button
                            onClick={() => setActiveTab("payouts")}
                            className={`text-xl px-5 py-2 text-gray-950 rounded-md ${
                                activeTab === "payouts"
                                    ? "font-semibold"
                                    : "font-normal"
                            }`}
                        >
                            PAYOUTS
                        </button>
                        <button
                            onClick={() => setActiveTab("refund")}
                            className={` text-xl px-5 py-2 text-gray-950 rounded-md ${
                                activeTab === "refund"
                                    ? "font-semibold"
                                    : "font-normal"
                            }`}
                        >
                            REFUND
                        </button>
                    </div>
                    {/* Bottom line under the buttons */}
                    <div className="mb-4 border-b border-gray-300 "></div>

                    {/* Display content based on the active tab */}
                    {activeTab === "payouts" ? (
                        <div className="border rounded-md ">
                            {/* <h3 className="mb-2 text-lg font-semibold">
                                Payouts Table
                            </h3> */}
                            {/* Your Payouts table content goes here */}
                            <table className="min-w-full">
                                <thead className="border-b border-gray-500">
                                    <tr>
                                        <th className="px-1 py-4 font-sans">
                                            Room Type
                                        </th>
                                        <th className="px-4 py-2">
                                            Check-In/Out
                                        </th>
                                        <th className="px-4 py-2">
                                            Mode of Payment
                                        </th>
                                        <th className="px-4 py-2">
                                            Amount to Pay
                                        </th>
                                        <th className="px-4 py-2">Host</th>
                                        <th className="px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Example Payouts rows */}
                                    {/* <tr>
                                        <td className="px-8 py-2">1</td>
                                        <td className="px-8 py-2">$500</td>
                                        <td className="px-8 py-2">
                                            2025-02-11
                                        </td>
                                    </tr> */}
                                    {/* Add more rows as needed */}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="border rounded-md">
                            {/* <h3 className="mb-2 text-lg font-semibold">
                                Refund Table
                            </h3> */}
                            {/* Your Refund table content goes here */}
                            <table className="min-w-full">
                                <thead className="border-b border-gray-500">
                                    <tr>
                                        <th className="px-1 py-4 font-sans">
                                            Room Type
                                        </th>
                                        <th className="px-4 py-2">
                                            Check-In/Out
                                        </th>
                                        <th className="px-4 py-2">
                                            Mode of Payment
                                        </th>
                                        <th className="px-4 py-2">
                                            Amount to Pay
                                        </th>
                                        <th className="px-4 py-2">Host</th>
                                        <th className="px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Example Refund rows */}
                                    <tr>
                                        {/* <td className="px-4 py-2">1</td>
                                        <td className="px-4 py-2">$100</td>
                                        <td className="px-4 py-2">
                                            2025-02-10
                                        </td> */}
                                    </tr>
                                    {/* Add more rows as needed */}
                                </tbody>
                            </table>
                        </div>
                    )}
                </ContentCard>
            </div>
        </div>
    );
};

export default FinancialAdministration;
