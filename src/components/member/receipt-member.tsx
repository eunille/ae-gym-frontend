import React from "react";
import dataFetch from "@/service/data-service";
import { useAuth } from "@/context/auth-context";
import { Member } from "@/models/member";
import { dateFormatter } from "@/utils/formatter";
import logo from "@/assets/images/gym-logo.png";

interface ReceiptProps {
  onClose: () => void;
  memberData: Member;
  onUpdate: () => void;
  onConfirm: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({
  onClose,
  memberData,
  onUpdate,
  onConfirm,
}) => {
  const { token } = useAuth();

  const createMember = async () => {
    try {
      const url = "api/members/";
      const method = "POST";

      if (!token) {
        console.error("Token not available.");
        return;
      }

      const response = await dataFetch(url, method, memberData, token);
      console.log("Member created:", response);
      onUpdate();
      onConfirm();
    } catch (error) {
      console.error("Error creating member:", error);
    }
  };



  console.log("Member Data:", memberData);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-gray-600 font-semibold text-lg">Receipt</h2>
              <p className="text-gray-500 mt-1">
              </p>
            </div>
            <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
          </div>


         
          <div>
            <p className="text-gray-800 font-semibold">Customer Information</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-500">Name:</span>
              <span className="text-gray-800">
                {memberData.first_name} {memberData.last_name}
              </span>
            </div>
          </div>

          {/* Confirm and Cancel Buttons */}
          <div className="mt-6 flex justify-around">
            <button
              className="px-6 py-2 text-black bg-[#FCD301] rounded-md shadow-md focus:outline-none focus:ring-2 border-2 border-black"
              onClick={createMember}
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
    </div>
  );
};

export default Receipt;
