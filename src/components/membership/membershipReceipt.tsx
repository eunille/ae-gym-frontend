import React from "react";
import logo from "@/assets/images/gym-logo.png";

interface MembershipReceiptProps {
  onClose: () => void;
  isOpen: boolean;
  memberData: {
    name: string;
    dateRegistered: string;
    membershipType: string;
    price: number;
  };
  onConfirm: () => void;
}

const MembershipReceipt: React.FC<MembershipReceiptProps> = ({
  onClose,
  isOpen,
  memberData,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
    
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Membership Receipt</h2>
          <img src={logo} alt="Gym Logo" className="h-12 w-12 object-contain" />
        </div>

        <div className="text-gray-700 space-y-4">
          <div>
            <p className="font-medium">Customer Name:</p>
            <p>{memberData.name}</p>
          </div>
          <div>
            <p className="font-medium">Date Registered:</p>
            <p>{memberData.dateRegistered}</p>
          </div>
          <div>
            <p className="font-medium">Membership Type:</p>
            <p>{memberData.membershipType}</p>
            <p>Price: ${memberData.price}</p>
          </div>
        </div>

      
        <div className="mt-6 flex justify-center gap-4">
          <button
            className="px-6 py-2 text-black bg-[#FCD301] rounded-md shadow-md focus:outline-none focus:ring-2 border-2 border-black"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="px-6 py-2 text-white bg-red-400 rounded-md shadow-md hover:bg-red-500 focus:outline-none focus:ring-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipReceipt;
