import React, { useState, useEffect } from "react";
import MembershipReceipt from "./membershipReceipt";
import { Member } from "@/models/member";
import { useAuth } from "@/context/auth-context";

interface MembershipPurchaseProps {
  onClose: () => void;
  isOpen: boolean;
  fetchMembership: () => void;
  selectedMember: Member | null;
  dailyPrice: number;
  monthlyPrice: number;
}

const MembershipPurchase: React.FC<MembershipPurchaseProps> = ({
  onClose,
  isOpen,
  fetchMembership,
  selectedMember,
  dailyPrice,
  monthlyPrice,
}) => {
  const [membershipType, setMembershipType] = useState<string>("");
  const [dateRegistered, setDateRegistered] = useState<string>("");
  const [isReceiptOpen, setReceiptOpen] = useState<boolean>(false);
  const [isPurchaseSuccess, setPurchaseSuccess] = useState<boolean>(false);

  const { token } = useAuth();

  const calculatePrice = (type: string): number => {
    switch (type) {
      case "Daily":
        return dailyPrice;
      case "Monthly":
        return monthlyPrice;
      default:
        return 0;
    }
  };

  const membershipTypeIdMap: Record<string, number> = {
    Daily: 1,
    Monthly: 2,
  };

  const payload = {
    member: selectedMember?.id || 0,
    membership: membershipTypeIdMap[membershipType],
  };

  const getMemberData = () => ({
    name: selectedMember
      ? `${selectedMember.first_name} ${selectedMember.last_name}`
      : "Guest",
    membershipType,
    dateRegistered,
    price: calculatePrice(membershipType),
  });

  useEffect(() => {
    if (!isOpen) {
      setMembershipType("");
      setDateRegistered("");
    }
  }, [isOpen]);

  const validateInputs = (): boolean => {
    if (!membershipType || !dateRegistered || !selectedMember) {
      alert("Please fill out all fields.");
      return false;
    }
    return true;
  };

  const handleProceed = () => {
    if (validateInputs()) {
      setReceiptOpen(true);
    }
  };

  const onPurchaseSuccess = () => {
    setReceiptOpen(false);
    onClose(); 
  };

  if (!isOpen && !isReceiptOpen) return null;

  return (
    <>
      {isOpen && !isReceiptOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-lg border-2 border-gray-300">
            <h1 className="text-2xl font-semibold text-center mb-6">
              Purchase Membership
            </h1>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Membership Type
                </label>
                <select
                  value={membershipType}
                  onChange={(e) => setMembershipType(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FCD301] focus:ring-offset-2"
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
                  className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FCD301] focus:ring-offset-2"
                />
              </div>
            </form>

            <div className="flex justify-center gap-6 mt-6">
              <button
                type="button"
                onClick={handleProceed}
                className="px-6 py-3 w-32 bg-[#FCD301] text-black  text-md rounded-lg rounded-tl-lg font-semibold border-2 border-black"
              >
                Proceed
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 w-32 text-white bg-red-500  text-md rounded-lg rounded-tl-lg font-semibold border-2 border-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isReceiptOpen && (
        <MembershipReceipt
          isOpen={isReceiptOpen}
          onClose={() => setReceiptOpen(false)}
          onCancel={onClose}
          memberData={getMemberData()}
          payload={payload}
          token={token!}
          fetchMembership={fetchMembership}
          onPurchaseSuccess={onPurchaseSuccess}
        />
      )}
    </>
  );
};

export default MembershipPurchase;
