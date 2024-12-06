import React from "react";
import { Product } from "@/models/product";
import { Member } from "@/models/member";


interface PurchaseReceiptProps {
  purchaseData: {
    products: Product[];
    quantities: { [key: string]: number };
    totalAmount: number;
    selectedMember: Member | null;
  };
  onClose: () => void;
  isReceiptOpen: boolean;
}

const PurchaseReceipt: React.FC<PurchaseReceiptProps> = ({ purchaseData, onClose, isReceiptOpen }) => {
  const { products, quantities, totalAmount, selectedMember } = purchaseData;

  if (!isReceiptOpen) {
    return null;
  }

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
        <p className="text-gray-600 mb-4">Date: {new Date().toLocaleDateString()}</p>

   
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-800">Products</h3>
          {products.map((product) => {
            const quantity = quantities[product.id] || 0;
            if (quantity > 0) {
              return (
                <div key={product.id} className="flex justify-between mt-2">
                  <span>
                    {product.name} x{quantity}
                  </span>
                  <span>P{(product.price * quantity).toFixed(2)}</span>
                </div>
              );
            }
            return null;
          })}
        </div>

    
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between font-semibold text-gray-800 text-lg">
            <span>Total</span>
            <span>P{totalAmount.toFixed(2)}</span>
          </div>
        </div>

     
        <div className="mt-4">
          <h3 className="font-semibold text-lg text-gray-800">Customer Information</h3>
          <div className="flex justify-between mt-2">
            <span>User ID</span>
            <span>{selectedMember?.id || "N/A"}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Name</span>
            <span>{selectedMember?.first_name} {selectedMember?.last_name}</span>
          </div>
        </div>

      
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
