import React, { useState } from "react";

const PurchaseMembership = () => {
  const [membershipType, setMembershipType] = useState("");
  const [dateRegistered, setDateRegistered] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md border-2 border-black">
        <h1 className="text-xl font-bold text-center mb-4">Purchase Membership</h1>
        <form className="grid grid-cols-1 gap-4">
          {/* Membership Type */}
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

          {/* Date Registered */}
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
            onClick={() => console.log("Membership Purchased")}
            className="px-6 py-2 w-32 text-black bg-[#FCD301] rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-black"
          >
            Confirm
          </button>

          <button
            type="button"
            onClick={() => console.log("Purchase Cancelled")}
            className="px-6 py-2 w-32 text-white bg-red-400 rounded-md shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseMembership;
