import React, { useState } from "react";
import MembershipReceipt from "./membershipReceipt";
import { Member } from "@/models/member";

interface PurchaseMembershipProps {
  onClose: () => void;
  isOpen: boolean;
  fetchMembership: () => void;
  selectedMember: Member | null;
}

const PurchaseMembership = ({
  onClose,
  isOpen,
  fetchMembership,
  selectedMember,
}: PurchaseMembershipProps) => {
  const [membershipType, setMembershipType] = useState("");
  const [dateRegistered, setDateRegistered] = useState("");
  const [isReceiptOpen, setReceiptOpen] = useState(false);

  const handleConfirm = () => {
    if (!membershipType || !dateRegistered) {
      alert("Please fill out all fields.");
      return;
    }

    console.log("Membership Purchased");
    setReceiptOpen(true); // Open the receipt modal
    onClose(); // Close the PurchaseMembership modal
  };

  const calculatePrice = (type: string): number => {
    switch (type) {
      case "Daily":
        return 10; // Example price for Daily membership
      case "Monthly":
        return 100; // Example price for Monthly membership
      default:
        return 0; // Default price if no valid type
    }
  };

  const getMemberData = (
    selectedMember: Member | null,
    membershipType: string,
    dateRegistered: string
  ) => ({
    name: selectedMember
      ? `${selectedMember.first_name} ${selectedMember.last_name}`
      : "Guest",
    membershipType,
    dateRegistered,
    price: calculatePrice(membershipType),
  });

  if (!isOpen && !isReceiptOpen) {
    return null; // Prevent rendering if both modals are closed
  }

  return (
    <>
      {/* Purchase Membership Modal */}
      {isOpen && !isReceiptOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md border-2 border-black">
            <h1 className="text-xl font-bold text-center mb-4">
              Purchase Membership
            </h1>
            <form className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Membership Type
                </label>
                <select
                  value={membershipType}
                  onChange={(e) => setMembershipType(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="" disabled>
                    Select Membership Type
                  </option>
                  <option value="Daily">Daily</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Registered
                </label>
                <input
                  type="date"
                  value={dateRegistered}
                  onChange={(e) => setDateRegistered(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </form>
            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={handleConfirm}
                className="px-6 py-2 w-32 text-black bg-[#FCD301] rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-black"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 w-32 text-white bg-red-400 rounded-md shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Membership Receipt Modal */}
      {isReceiptOpen && (
        <MembershipReceipt
          isOpen={isReceiptOpen}
          onClose={() => setReceiptOpen(false)}
          memberData={getMemberData(selectedMember, membershipType, dateRegistered)}
          onConfirm={() => {
            setReceiptOpen(false);
            fetchMembership();
          }}
        />
      )}
    </>
  );
};

export default PurchaseMembership;
