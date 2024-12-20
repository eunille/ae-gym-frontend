import React, { useState, useEffect } from "react";
import MembershipReceipt from "./membershipReceipt";
import { Member, Membership } from "@/models/member";
import { useAuth } from "@/context/auth-context";

interface MembershipPurchaseProps {
  onClose: () => void;
  isOpen: boolean;
  fetchMembership: () => void;
  selectedMember: Member | null;
  membershipTypes: Membership[];
  onPurchaseSuccess: () => void; 
}

const MembershipPurchase: React.FC<MembershipPurchaseProps> = ({
  onClose,
  isOpen,
  fetchMembership,
  selectedMember,
  membershipTypes,
  onPurchaseSuccess, 
}) => {
  const [membershipType, setMembershipType] = useState<string>("");
  const [dateRegistered, setDateRegistered] = useState<string>("");
  const [isReceiptOpen, setReceiptOpen] = useState<boolean>(false);

  const { token } = useAuth();

  const payload = {
    member: selectedMember?.id || 0,
    membership: membershipType,
    price:
      membershipTypes.find((type) => type.id.toString() === membershipType)
        ?.price || "0.00",
    date_registered: dateRegistered,
  };

  const getMemberData = () => ({
    name: selectedMember
      ? `${selectedMember.first_name} ${selectedMember.last_name}`
      : "Guest",
    membershipType:
      membershipTypes.find((type) => type.id.toString() === membershipType)
        ?.membership_type || "",
    dateRegistered,
    price:
      membershipTypes.find((type) => type.id.toString() === membershipType)
        ?.price || "0.0",
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

  const onPurchaseSuccessHandler = () => {
    setReceiptOpen(false);
    fetchMembership();
    onPurchaseSuccess(); 
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
                {membershipTypes.map((type) => (
                  <option key={type.id} value={type.id.toString()}>
                    {type.membership_type}
                  </option>
                ))}
              </select>

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
                className="px-6 py-3 w-32 bg-[#FCD301] text-black text-md rounded-lg rounded-tl-lg font-semibold border-2 border-black"
              >
                Proceed
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 w-32 text-white bg-red-500 text-md rounded-lg rounded-tl-lg font-semibold border-2 border-black"
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
          onPurchaseSuccess={onPurchaseSuccessHandler} 
        />
      )}
    </>
  );
};

export default MembershipPurchase;
