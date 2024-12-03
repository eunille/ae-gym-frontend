import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Product } from "@/models/product";
import dataFetch from "@/service/data-service";
import { Member } from "@/models/member";
import PurchaseReceipt from "./purchaseReceipt"; 

interface PurchaseProps {
  onClosePurchase: () => void;
  isOpenPurchase: boolean;
  onSubmitPurchase: (data: any) => void;
  selectedMember: Member | null;
}

const PurchaseModal = ({
  onClosePurchase,
  isOpenPurchase,
  onSubmitPurchase,
  selectedMember
}: PurchaseProps) => {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReceiptOpen, setIsReceiptOpen] = useState(false); 
  const [purchaseData, setPurchaseData] = useState<any>(null); 
  const [warning, setWarning] = useState<string>("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const fetchedProducts = await dataFetch("api/products/", "GET", {}, token!);
      setProducts(fetchedProducts);
      setQuantities(
        fetchedProducts.reduce((acc: { [key: string]: number }, product: Product) => {
          acc[product.id] = 0;
          return acc;
        }, {})
      );
    } catch (error) {
      setError("Failed to load products.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpenPurchase) {
      fetchProducts();
    }
  }, [isOpenPurchase]);

  const handleIncrement = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setWarning(""); 
  };

  const handleDecrement = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
    setWarning("")
  };

  const handleConfirm = () => {
   
    const isAnyProductSelected = products.some(
      (product) => quantities[product.id] > 0
    );

    if (!isAnyProductSelected) {
      setWarning("Please select at least one product.");
      return; 
    }

   
    const selectedData = {
      memberId: selectedMember?.id,
      products: products.map((product) => ({
        id: product.id,
        quantity: quantities[product.id] || 0,
      })),
    };

    const totalAmount = products.reduce(
      (total, product) => total + product.price * (quantities[product.id] || 0),
      0
    );

    setPurchaseData({
      ...selectedData,
      totalAmount,
      selectedMember,
    });

    setIsReceiptOpen(true); 
    onSubmitPurchase(selectedData); 
  };

  return (
    <div>
      {isOpenPurchase && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg transform transition-all duration-300">
            <h2 className="text-gray-800 font-bold text-2xl mb-6 text-center">
              Purchase for {selectedMember?.first_name} {selectedMember?.last_name}
            </h2>
            <hr className="mb-6 border-t-2 border-gray-200" />

            {loading && <p className="text-center text-gray-500">Loading products...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="font-semibold text-gray-700">{product.name}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-[#FCD301] text-black rounded-full font-bold shadow hover:bg-yellow-400"
                        onClick={() => handleIncrement(product.id.toString())}
                      >
                        +
                      </button>
                      <span className="px-4 py-2 text-gray-700 font-semibold bg-gray-100 rounded-md shadow-inner">
                        {quantities[product.id] || 0}
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full font-bold shadow hover:bg-gray-800"
                        onClick={() => handleDecrement(product.id.toString())}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {warning && <p className="text-red-500 text-center mt-4">{warning}</p>}

            <div className="flex justify-between mt-8">
              <button
                className="px-8 py-2 bg-[#FCD301] text-gray-800 font-bold rounded-lg shadow-lg border border-black transform transition hover:bg-yellow-500 hover:scale-105"
                onClick={handleConfirm}
              >
                Confirm
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
      )}

      {isReceiptOpen && purchaseData && (
        <PurchaseReceipt
          purchaseData={purchaseData} 
          onClose={() => setIsReceiptOpen(false)} 
          isReceiptOpen={isReceiptOpen}
        />
      )}
    </div>
  );
};

export default PurchaseModal;
