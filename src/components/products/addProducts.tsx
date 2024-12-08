import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";

interface AddProductProps {
  onClose: () => void;
  isOpen: boolean;
  fetchProduct: () => void; 

}

const AddProducts = ({ onClose, isOpen, fetchProduct }: AddProductProps) => {
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [price, setPrice] = useState("");
  const [productType, setProductType] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddProduct = async () => {
    if (!name || !price || !productType || !image) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("product_type", productType);
    formData.append("image", image);

    console.log("Form Data being sent:", Object.fromEntries(formData.entries()));

    try {
      const response = await fetch("http://127.0.0.1:8000/api/products/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setName("");
        setPrice("");
        setProductType("");
        setImage(null);

        fetchProduct(); 
        onClose(); 
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to add product"}`);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error(error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-xl font-semibold mb-6 text-gray-800">Add Product</h1>
        <div className="flex space-x-8">
          {/* Image Upload Section */}
          <div className="w-1/2 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-3/4 h-80 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Product Preview" className="object-cover h-full w-full" />
              ) : (
                <span className="text-gray-400">Image Preview</span>
              )}
              <label className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-semibold cursor-pointer transition-opacity">
                <span>Click to Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="w-1/2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Type</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setProductType("Product")}
                  className={`px-4 py-2 rounded-lg ${
                    productType === "Product" ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                >
                  Product
                </button>
                <button
                  onClick={() => setProductType("Services")}
                  className={`px-4 py-2 rounded-lg ${
                    productType === "Services" ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                >
                  Services
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                placeholder="Enter price"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={handleAddProduct}
            className="py-2 px-5 bg-[#FCD301] text-black font-semibold rounded-lg shadow border-2 border-black"
          >
            Add
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
