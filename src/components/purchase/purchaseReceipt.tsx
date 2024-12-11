import React, { useState, useEffect } from "react";
import logo from "@/assets/images/gym-logo.png";
import dataFetch from "@/service/data-service";
import { useAuth } from "@/context/auth-context";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  product_type: string;
}

interface PurchaseData {
  products: Product[];
  quantities: { [productId: number]: number };
  totalAmount: number;
}

interface PurchaseReceiptProps {
  onClose: () => void;
  isReceiptOpen: boolean;
  purchaseData: PurchaseData | undefined;
  member: any;
}

const PurchaseReceipt: React.FC<PurchaseReceiptProps> = ({
  purchaseData,
  onClose,
  isReceiptOpen,
  member,
}) => {
  const [products, setProducts] = useState<PurchaseData | undefined>(purchaseData);
  const { token } = useAuth();

  useEffect(() => {
    if (purchaseData) {
      setProducts(purchaseData);
    }
  }, [purchaseData]);

  const handleSubmit = async () => {
    if (products) {
      for (const product of products.products) {
        const quantity = products.quantities[product.id].toString();
        const price = product.price.toString();

        const payload = {
          quantity,
          price,
          member: member?.id || 0,
          product: product.id,
        };

        try {
          await dataFetch("api/purchases/", "POST", JSON.stringify(payload), token!);
          onClose();
        } catch (error) {
          console.error("Error submitting product:", error);
        }
      }
    }
  };

  if (!isReceiptOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
     
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Purchase Details</h2>
          <img src={logo} alt="Gym Logo" className="h-12 w-12 object-contain" />
        </div>
        <p className="text-gray-600 mb-4">Date: {new Date().toLocaleDateString()}</p>

     
        <hr className="my-4 border-gray-300" />

      
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-gray-800">Products & Services</h3>
          {products && products.products.length > 0 ? (
            products.products.map((product, index) => {
              const quantity = products.quantities[product.id];
              const totalAmount = product.price * quantity;

              return (
                <div key={index} className="flex justify-between mt-2 text-gray-600">
                  <span>{`${product.name} x${quantity}`}</span>
                  <span>{`P${totalAmount.toFixed(2)}`}</span>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No products in this purchase.</p>
          )}
        </div>

       

     
        <hr className="my-4 border-gray-300" />

      
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-gray-800">Total</h3>
          <p className="flex justify-between text-gray-600 mt-2">
            <span>Total</span>
            <span>{`P${products?.totalAmount || 0}`}</span>
          </p>
        </div> 

      
        <hr className="my-4 border-gray-300" />

       
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-gray-800">Customer Information</h3>
          <p className="text-gray-600">
            User ID: {member?.id || "N/A"}
          </p>
        </div>

     
        

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            className="py-2 px-4 bg-[#FCD301] text-black font-semibold rounded-lg shadow border-2 border-black"
            onClick={handleSubmit}
          >
            Confirm
          </button>
          <button
            className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
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
