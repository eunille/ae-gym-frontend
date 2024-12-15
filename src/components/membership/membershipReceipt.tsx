import React from "react";
import logo from "@/assets/images/gym-logo.png";
import dataFetch from "@/service/data-service";

interface MembershipReceiptProps {
  onClose: () => void;
  isOpen: boolean;
  memberData: {
    name: string;
    dateRegistered: string;
    membershipType: string;
    price: string;
  };
  payload: { member: number; membership: string };
  token: string;
  fetchMembership: () => void;
  onPurchaseSuccess: () => void; // Added the callback prop
  onCancel: () => void;
}

const MembershipReceipt: React.FC<MembershipReceiptProps> = ({
  onClose,
  isOpen,
  memberData,
  payload,
  token,
  fetchMembership,
  onCancel,
  onPurchaseSuccess, // Using the prop
}) => {
  const handleConfirm = async () => {
    try {
      const response = await dataFetch(
        "/api/membership-transactions/",
        "POST",
        payload,
        token
      );

      if (response && response.id) {
        console.log("Membership purchased successfully");
        onPurchaseSuccess(); // Call the success callback here
      } else {
        console.error("Unexpected response:", response);
        alert("Failed to process the membership transaction.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleCancel = () => {
    onCancel(); // Trigger cancellation callback
    onClose(); // Close the receipt modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Membership Receipt
          </h2>
          <img src={logo} alt="Gym Logo" className="h-20 w-20 object-contain" />
        </div>
        <p className="text-gray-600 mb-4">
          Date: {new Date().toLocaleDateString()}
        </p>

        <hr className="my-4 border-gray-300" />

        <div className="mb-6">
          <h3 className="font-semibold text-lg text-gray-800">
            Customer Information
          </h3>
          <p className="text-gray-600">Name: {memberData.name}</p>
          <p className="text-gray-600">
            Date Registered: {memberData.dateRegistered}
          </p>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="mb-6">
          <h3 className="font-semibold text-lg text-gray-800">
            Membership Details
          </h3>
          <p className="flex justify-between text-gray-600 mt-2">
            <span>Membership Type</span>
            <span>{memberData.membershipType}</span>
          </p>
          <p className="flex justify-between text-gray-600 mt-2">
            <span>Price</span>
            <span>{`P${memberData.price}`}</span>
          </p>
        </div>

        <div className="flex justify-between">
          <button
            className="py-2 px-4 bg-[#FCD301] text-black font-semibold rounded-lg shadow border-2 border-black"
            onClick={handleConfirm}
          >
            Confirm
          </button>
          <button
            className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipReceipt;
