import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Product } from "@/models/product";
import dataFetch from "@/service/data-service";
import decryptionService from "@/service/decryption-service";
import { Member } from "@/models/member";

interface PurchaseProps {
  onClosePurchase: () => void;
  isOpenPurchase: boolean;
  onSubmitPurchase: (data: any) => void;
  selectedMember: Member | null;
  openReceipt: (purchaseDetails: any) => void;
  data: any;
}

const PurchaseModal = ({
  onClosePurchase,
  isOpenPurchase,
  onSubmitPurchase,
  selectedMember,
  openReceipt,
  data,
}: PurchaseProps) => {
  const { token } = useAuth();
  const [itemsByType, setItemsByType] = useState<{ [key: string]: Product[] }>({});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState<string>("");

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const encryptedItems = await dataFetch("api/products/", "GET", {}, token!);
      const secret = await dataFetch("api/secret-key/", "GET", {}, token!);
      const decryptedItems = decryptionService(secret, encryptedItems);

      const groupedItems = decryptedItems.reduce(
        (acc: { [key: string]: Product[] }, item: Product) => {
          if (!acc[item.product_type]) acc[item.product_type] = [];
          acc[item.product_type].push(item);
          return acc;
        },
        {}
      );

      setItemsByType(groupedItems);

      setQuantities(
        decryptedItems.reduce((acc: { [key: string]: number }, item: Product) => {
          acc[item.id] = 0;
          return acc;
        }, {})
      );
    } catch (error) {
      setError("Failed to load items.");
      console.error("Error fetching and decrypting items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpenPurchase) {
      fetchItems();
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
    setWarning("");
  };

  const handleConfirm = async () => {
    const isAnyItemSelected = Object.values(quantities).some((qty) => qty > 0);

    if (!isAnyItemSelected) {
      setWarning("Please select at least one item.");
      return;
    }

    try {
      let purchaseDetails: {
        products: Product[];
        quantities: { [key: string]: number };
        totalAmount: number;
      } = {
        products: [],
        quantities: {},
        totalAmount: 0,
      };

      for (const [product_id, quantity] of Object.entries(quantities)) {
        if (quantity > 0) {
          const item = Object.values(itemsByType).flat().find(
            (product) => product.id.toString() === product_id
          );
          if (item) {
            purchaseDetails.products.push(item);
            purchaseDetails.quantities[item.id] = quantity;
            purchaseDetails.totalAmount += item.price * quantity;

            const purchaseData = {
              quantity: quantity.toString(),
              price: item.price.toString(),
              member: selectedMember?.id || 0,
              product: item.id,
            };

            openReceipt(purchaseData);
            data(purchaseDetails);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting purchase:", error);
    }

    onClosePurchase();
  };

  const renderItemsByType = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center">
          <div className="spinner-border animate-spin h-8 w-8 border-4 border-t-4 border-gray-500 rounded-full"></div>
        </div>
      );
    }
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return Object.entries(itemsByType).map(([type, items]) => (
      <div key={type}>
        <h3 className="text-lg font-bold text-gray-800 mt-6">{type}</h3>
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg mb-4">
            <div>
              <span className="font-semibold text-gray-700">{item.name}</span>
              <div className="text-sm text-gray-500">Price: ₱{item.price}</div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="w-8 h-8 bg-[#FCD301] text-black rounded-full font-bold transition-all duration-300 transform hover:scale-110"
                onClick={() => handleIncrement(item.id.toString())}
              >
                +
              </button>
              <span className="px-4 text-gray-700 font-semibold">{quantities[item.id] || 0}</span>
              <button
                className="w-8 h-8 bg-black text-white rounded-full font-bold transition-all duration-300 transform hover:scale-110"
                onClick={() => handleDecrement(item.id.toString())}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div>
      {isOpenPurchase && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <h2 className="text-gray-800 font-bold text-2xl mb-6 text-center">
              Purchase for {selectedMember?.first_name} {selectedMember?.last_name}
            </h2>
            <hr className="mb-2 border-t-2 border-gray-200" />

            <div className="max-h-96 overflow-y-auto pb-4">{renderItemsByType()}</div>

            {warning && <p className="text-red-500 text-center mt-4">{warning}</p>}

            <div className="flex justify-between mt-8 gap-4">
              <button
                className="px-8 py-2 bg-[#FCD301] text-black  text-md rounded-lg rounded-tl-lg font-semibold border-2 border-black transition duration-200"
                onClick={handleConfirm}
              >
                Confirm
              </button>
              <button
              className="px-8 py-2 text-white bg-red-500 rounded-md shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 border-2 border-black transition duration-200"
                onClick={onClosePurchase}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseModal;
