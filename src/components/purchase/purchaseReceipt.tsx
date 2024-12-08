import React, { useState, useEffect } from "react";
import logo from "@/assets/images/gym-logo.png";
import dataFetch from "@/service/data-service";
import { useAuth } from "@/context/auth-context";
import member from "@/models/member";


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
  member
}) => {
  const [products, setProducts] = useState<PurchaseData | undefined>(purchaseData); 


  console.log("purchaseData received in useEffect:", purchaseData);
  console.log("member", member);

  const { token, id } = useAuth();


  useEffect(() => {
    if (purchaseData) {
      setProducts(purchaseData);
    }
  }, [purchaseData]);

  console.log(products, "dsfda");

  const handleSubmit = async () => {
    if (products) {
      for (const product of products.products) {
        const quantity = products.quantities[product.id].toString(); 
        const price = product.price.toString(); 
  
        const payload = {
          quantity: quantity, 
          price: price, 
          member: member?.id || 0, 
          product: product.id, 
        };
  
        console.log("Payload for product", product.id, ":", payload);
  
        try {
          const response = await dataFetch("api/purchases/", "POST", JSON.stringify(payload), token!);
          console.log("Product submitted:", response);
          onClose();
        } catch (error) {
          console.error("Error submitting product:", error);
          console.log("Payload failed:", payload);
        }
      }
    }
  };
  

  if (!isReceiptOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Purchase Receipt</h2>
          <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
        </div>
        <p className="text-gray-600 mb-4">Date: {new Date().toLocaleDateString()}</p>

        

        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-800">Products</h3>
          <div>
            {products && products.products.length > 0 ? (
              products.products.map((product, index) => {
                const quantity = products.quantities[product.id];
                const totalAmount = product.price * quantity;

                return (
                  <div key={index} className="flex justify-between mt-2 text-gray-600">
                    <span>
                      Product #{product.name || product.id} x {quantity}
                    </span>
                    <span>P{totalAmount.toFixed(2)}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No products in this purchase.</p>
            )}
          </div>
        </div>


        {/* Display customer information */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-800">Customer Information</h3>
          <div className="text-gray-600">
            <p>User ID: {member.id}</p>
            <p>Name: {member.name}</p>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="px-6 py-2 bg-[#FCD301] text-gray-800 font-bold rounded-lg"
            onClick={handleSubmit}
          >
            Confirm
          </button>
          <button
            className="px-6 py-2 bg-[#FCD301] text-gray-800 font-bold rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseReceipt;