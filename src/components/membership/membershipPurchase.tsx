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

<<<<<<< HEAD:src/components/membership/purchaseMembership.tsx
  const handleConfirm = () => {
    if (!membershipType || !dateRegistered) {
      alert("Please fill out all fields.");
      return;
    }

    console.log("Membership Purchased");
    setReceiptOpen(true);
    onClose(); 
  };
=======
  const { token } = useAuth();
>>>>>>> 74abec615925cf7ff33be515a1794d86e5d23c30:src/components/membership/membershipPurchase.tsx

  const calculatePrice = (type: string): number => {
    switch (type) {
      case "Daily":
<<<<<<< HEAD:src/components/membership/purchaseMembership.tsx
        return 10; 
      case "Monthly":
        return 100; 
      default:
        return 0; 
=======
        return dailyPrice;
      case "Monthly":
        return monthlyPrice;
      default:
        return 0;
>>>>>>> 74abec615925cf7ff33be515a1794d86e5d23c30:src/components/membership/membershipPurchase.tsx
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

<<<<<<< HEAD:src/components/membership/purchaseMembership.tsx
  if (!isOpen && !isReceiptOpen) {
    return null; 
  }
=======
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
>>>>>>> 74abec615925cf7ff33be515a1794d86e5d23c30:src/components/membership/membershipPurchase.tsx

  return (
    <>
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
                onClick={handleProceed}
                className="px-6 py-2 w-32 text-black bg-[#FCD301] rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-black"
              >
                Proceed
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
