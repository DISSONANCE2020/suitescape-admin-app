import React, { useState } from "react";
import FinanceListingDetailsModal from "./FinanceListingDetailsModal";
import PaymongoLinkModal from "./PaymongoLinkModal";
const FinancePayoutDetails = ({
    booking,
    users,
    invoices,
    listings,
    payoutMethods,
    onClose,
    onGeneratePayoutLink,
}) => {
    if (!booking) return null;

    const listing = listings?.find((l) => l.id === booking?.listing_id);
    const host = users?.find((u) => u.id === listing?.user_id);
    const guest = users?.find((u) => u.id === booking?.user_id);
    const invoice = invoices?.find((i) => i.booking_id === booking?.id);
    const payoutMethod = payoutMethods?.find((p) => p.user_id === host?.id);

    const amountPaid = parseFloat(booking.amount) || 0;
    const [suiteEscapeFeePercentage, setSuiteEscapeFeePercentage] = useState(3);
    const suitescapeFee = amountPaid * (suiteEscapeFeePercentage / 100);
    const payoutAmount = amountPaid - suitescapeFee;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedLink, setGeneratedLink] = useState("");

    const handleListingClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFeePercentageChange = (e) => {
        setSuiteEscapeFeePercentage(parseFloat(e.target.value));
    };

    const handleSendPayout = async (booking) => {
        try {
            setIsGenerating(true);
            const response = await fetch("/generate-paymongo-link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    )?.content,
                },
                body: JSON.stringify({
                    booking_id: booking.id,
                    amount: payoutAmount,
                }),
            });

            if (!response.ok)
                throw new Error("Failed to generate PayMongo link");

            const data = await response.json();
            const paymentLink = data.link;

            setGeneratedLink(paymentLink);
            setShowLinkModal(true); // Show modal instead of inline link
        } catch (error) {
            console.error("Failed to generate PayMongo link:", error);
            alert("Something went wrong generating the payment link.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            <h2 className="pb-2 m-2 text-4xl font-semibold capitalize">
                {listing?.facility_type || "N/A"}
            </h2>
            <p className="m-2 text-2xl capitalize font-poppins">
                {listing?.name || "Unknown"}
            </p>
            <div className="mt-6 mb-6 border border-gray-300"></div>

            <div className="grid grid-flow-col grid-cols-2">
                <div>
                    <h3 className="mb-6 ml-2 text-2xl font-semibold text-gray-500">
                        Payout Details
                    </h3>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Listing ID:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    <button
                                        onClick={handleListingClick}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {listing?.id}
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Host Email:
                                </td>
                                <td className="pb-4 text-xl">
                                    {host?.email || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-12 pl-4 text-xl font-semibold">
                                    Payout Status:
                                </td>
                                <td className="pb-12 text-xl capitalize">
                                    {payoutMethod?.transfer_status || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    SuiteEscape Fee (%):
                                </td>
                                <td className="pb-4 text-xl">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={suiteEscapeFeePercentage}
                                        onChange={handleFeePercentageChange}
                                        className="w-20 p-2 border border-gray-300 rounded-md"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Booking Amount:
                                </td>
                                <td className="pb-4 text-xl">
                                    ₱ {booking?.amount || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    SuiteEscape Fee ({suiteEscapeFeePercentage}
                                    %):
                                </td>
                                <td className="pb-4 text-xl">
                                    ₱ {suitescapeFee.toFixed(2)}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-bold">
                                    Payout Amount:
                                </td>
                                <td className="pb-4 text-xl font-bold">
                                    ₱ {payoutAmount.toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h3 className="mb-6 ml-2 text-2xl font-semibold text-gray-500">
                        Booking Details
                    </h3>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Guest Name:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    {guest
                                        ? `${guest.firstname} ${guest.lastname}`
                                        : "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Booking No:
                                </td>
                                <td className="pb-4 text-xl">
                                    {booking?.id || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Mode of Payment:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    {invoice?.payment_method || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Paid on:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    {booking.created_at
                                        ? new Intl.DateTimeFormat("en-US", {
                                              year: "numeric",
                                              month: "short",
                                              day: "2-digit",
                                          }).format(
                                              new Date(booking.created_at)
                                          )
                                        : "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Booking Date:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    {booking.date_start && booking.date_end
                                        ? `${new Intl.DateTimeFormat("en-US", {
                                              month: "short",
                                              day: "2-digit",
                                          }).format(
                                              new Date(booking.date_start)
                                          )} - ${new Intl.DateTimeFormat(
                                              "en-US",
                                              {
                                                  month: "short",
                                                  day: "2-digit",
                                              }
                                          ).format(
                                              new Date(booking.date_end)
                                          )}, ${new Date(
                                              booking.date_end
                                          ).getFullYear()}`
                                        : "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-4 pl-4 text-xl font-semibold">
                                    Booking Status:
                                </td>
                                <td className="pb-4 text-xl capitalize">
                                    {booking.status || "N/A"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col gap-3 p-3 mt-4 sm:flex-row">
                <button
                    onClick={onClose}
                    className="px-6 py-3 font-medium text-black bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300"
                >
                    Close
                </button>
                {host && (
                    <button
                        onClick={() => handleSendPayout(booking)}
                        disabled={
                            isGenerating ||
                            payoutMethod?.transfer_status === "sent"
                        }
                        className={`px-6 py-3 font-medium text-white rounded-md ${
                            isGenerating ||
                            payoutMethod?.transfer_status === "sent"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {isGenerating ? "Generating..." : "Send Payout"}
                    </button>
                )}
            </div>

            {showLinkModal && (
                <PaymongoLinkModal
                    link={generatedLink}
                    onClose={() => setShowLinkModal(false)}
                />
            )}

            {isModalOpen && (
                <FinanceListingDetailsModal
                    listing={listing}
                    users={users}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default FinancePayoutDetails;
