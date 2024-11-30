import React from "react";

interface PurchaseReceiptProps {
  onClose: () => void;
}

const PurchaseReceipt: React.FC<PurchaseReceiptProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Purchase Details</h2>
          <img
            src="../src/assets/img/logo/gym-logo.png"
            alt="Logo"
            className="w-12 h-12"
          />
        </div>
        <p className="text-gray-600 mb-4">Date: November 23, 2023</p>

        {/* Products Section */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-800">Products</h3>
          <div className="flex justify-between mt-2">
            <span>Creatine x2</span>
            <span>P40</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Mass Gainer x1</span>
            <span>P30</span>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-800 border-t">Services</h3>
          <div className="flex justify-between mt-2">
            <span>Towel</span>
            <span>P5</span>
          </div>
        </div>

        {/* Total Section */}
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between font-semibold text-gray-800 text-lg">
            <span>Total</span>
            <span>P125</span>
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg text-gray-800">Customer Information</h3>
          <div className="flex justify-between mt-2">
            <span>User ID</span>
            <span>4907</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="px-6 py-2 bg-[#FCD301] text-gray-800 font-bold rounded-lg shadow border border-black hover:bg-yellow-500 transition duration-200"
            onClick={onClose} 
          >
            Confirm
          </button>
          <button
            className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg shadow hover:bg-red-600 transition duration-200"
            onClick={onClose} 
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseReceipt;
