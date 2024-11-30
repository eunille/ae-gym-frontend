import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import dataFetch from "@/service/data-service";
import { Membership } from "@/models/member";
interface MemberPriceProps {
  isOpenMemberPrice: boolean;
  onCloseMemberPrice: () => void;
  fetchMemberPrice: () => void;
  membership: Membership[];
}

const MemberPrice = ({
  isOpenMemberPrice,
  onCloseMemberPrice,
  fetchMemberPrice,
  membership,
}: MemberPriceProps) => {
  const { token } = useAuth();
  const [dailyPrice, setDailyPrice] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [membershipType, setMembershipType] = useState<string | number>("");


  const handleAddMemberPrice = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/memberships/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([
          { membership_type: membershipType, price: dailyPrice }, 
          { membership_type: membershipType, price: monthlyPrice }, 
        ]),
      });

      if (response.ok) {
        alert("Membership prices added successfully.");
        setDailyPrice("");
        setMonthlyPrice("");
        setMembershipType(""); 
        onCloseMemberPrice();
        fetchMemberPrice();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to add membership prices."}`);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error(error);
    }
  };

  if (!isOpenMemberPrice) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Membership Pricing</h2>

        <div className="mb-4">
          <label htmlFor="dailyPrice" className="block text-gray-700 font-medium mb-2">
            Daily Price (₱):
          </label>
          <input
             id="dailyPrice"
             type="number"
             value={dailyPrice}
             onChange={(e) => setDailyPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter daily price"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="monthlyPrice" className="block text-gray-700 font-medium mb-2">
            Monthly Price (₱):
          </label>
          <input
            id="monthlyPrice"
            type="number"
            value={monthlyPrice}
            onChange={(e) => setMonthlyPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter monthly price"
          />
        </div>

        <div className="flex justify-between">
          <button
             onClick={handleAddMemberPrice}
            className="bg-black text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-800"
          >
            Save
          </button>
          <button
            onClick={onCloseMemberPrice}
            className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberPrice;
