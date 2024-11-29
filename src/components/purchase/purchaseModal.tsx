import React, { useState } from "react";
import { Member } from "@/models/member";
import RenewMembership from "@/components/renew/renewMembership";
interface PurchaseProps {
  onClosePurchase: () => void;
  isOpenPurchase: boolean;
  onSubmitPurchase: (data: any) => void;
  selectedMember: Member | null;
}

const Purchase = ({
  onClosePurchase,
  isOpenPurchase,
  onSubmitPurchase,
  selectedMember,
}: PurchaseProps) => {
  const [isOpenRenewMembership, setIsOpenRenewMembership] = useState(false);

  const handleOpenRenewMembership = () => {
    setIsOpenRenewMembership(true);
  };

  const handleCloseRenewMembership = () => {
    setIsOpenRenewMembership(false);
  };

  const handleSubmitRenewMembership = (data: any) => {

    console.log("Renewal Data Submitted:", data);
    handleCloseRenewMembership(); 
  };

  const [productQuantity, setProductQuantity] = useState(0);
  const [isServiceSelected, setIsServiceSelected] = useState(false);

  const handleIncrement = () => setProductQuantity((prev) => prev + 1);
  const handleDecrement = () => setProductQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  const handleServiceToggle = () => setIsServiceSelected((prev) => !prev);

  const handleConfirm = () => {
    const data = {
      memberId: selectedMember?.id,
      productQuantity,
      isServiceSelected,
    };
    onSubmitPurchase(data);
  };

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg transform transition-all duration-300">
          <h2 className="text-gray-800 font-bold text-2xl mb-6 text-center">
            Purchase for {selectedMember?.first_name} {selectedMember?.last_name}
          </h2>
          <hr className="mb-6 border-t-2 border-gray-200" />
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <label className="text-lg font-semibold text-gray-700">Products</label>
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-700">Services</label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Product Quantity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 font-medium">Product Name</span>
                <div className="flex items-center space-x-4">
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-[#FCD301] text-black rounded-full font-bold shadow hover:bg-yellow-400"
                    onClick={handleIncrement}
                  >
                    +
                  </button>
                  <span className="px-4 py-2 text-gray-700 font-semibold bg-gray-100 rounded-md shadow-inner">
                    {productQuantity}
                  </span>
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full font-bold shadow hover:bg-gray-800"
                    onClick={handleDecrement}
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
            {/* Service Checkbox */}
            <div>
              <div
                className="flex w-44 items-center p-4 mb-4 rounded-lg border-2 cursor-pointer transition duration-200 bg-white border-gray-300 hover:bg-gray-100"
                onClick={handleServiceToggle}
              >
                <input
                  type="checkbox"
                  className="mr-2 w-6 h-6 border-gray-300 rounded-sm text-black focus:ring-black"
                  checked={isServiceSelected}
                  onChange={handleServiceToggle}
                />
                <span className="text-gray-700 font-medium">Service Name</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <button
              className="px-8 py-2 bg-[#FCD301] text-gray-800 font-bold rounded-lg shadow-lg border border-black transform transition hover:bg-yellow-500 hover:scale-105"
              onClick={handleConfirm}
            >
              Confirm
            </button>
            <button
              className="px-6 py-2 w-32 text-white bg-black rounded-md shadow-md"
              onClick={handleOpenRenewMembership}
            >
              Renew
            </button>
            <button
              className="px-8 py-2 bg-red-500 text-white font-bold rounded-lg shadow-lg transform transition hover:bg-red-600 hover:scale-105"
              onClick={onClosePurchase}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Renew Membership Modal */}
      <RenewMembership
        onCloseRenewMembership={handleCloseRenewMembership}
        isOpenRenewMembership={isOpenRenewMembership}
        onSubmitRenewMembership={handleSubmitRenewMembership}
        selectedMember={selectedMember}
      />
    </div>
  );
};

export default Purchase;
