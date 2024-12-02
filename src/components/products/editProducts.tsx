import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Product } from "@/models/product";

interface ProductInformationProps {
  onClose: () => void;
  isOpen: boolean;
  selectedProductData: Product;
  callback: () => void;
}

const EditProducts = ({
  onClose,
  isOpen,
  selectedProductData,
  callback,
}: ProductInformationProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    id: "",
    image: "",
    product_type: "Product",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  const { token } = useAuth();
    if (!token) {
      alert("Authentication token is missing!");
      return;
    }

    useEffect(() => {
      if (isOpen && token) {
        fetchProductData(selectedProductData.id);
      }
    }, [isOpen, selectedProductData, token]);

    
  const fetchProductData = async (id: number) => {
    
    if (!token) {
      alert("Authentication token is missing!");
      return;
    }
    const url = `http://127.0.0.1:8000/api/products/${id}/`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const fetchedProduct = await response.json();
        setProduct(fetchedProduct);
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.detail || "Failed to fetch product details.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageFile(file);
      setProduct((prevProduct) => ({ ...prevProduct, image: URL.createObjectURL(file) }));
    }
  };

  const handleFormSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!product.name) errors.name = "Product name is required";
    if (!product.price) errors.price = "Price is required";
    if (!imageFile && !product.image) errors.image = "Product image is required";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("product_type", product.product_type);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const url = `http://127.0.0.1:8000/api/products/${product.id}/`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        console.log("Product updated successfully:", updatedProduct);
        setResponseMessage("Product updated successfully");
        setProduct(updatedProduct);
        callback();
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.detail || "Failed to update product");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  };

  const handleCancel = () => onClose();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-xl font-semibold mb-6 text-gray-800">Edit Product</h1>
        <div className="flex space-x-8">
          <div className="w-1/2 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-3/4 h-80 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              {product.image ? (
                <img src={product.image} alt="Product Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
              <label className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-semibold cursor-pointer transition-opacity">
                <span>Click to Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
          <div className="w-1/2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                placeholder="Enter product name"
              />
              {validationErrors.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Type</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setProduct((prev) => ({ ...prev, product_type: "Product" }))}
                  className={`px-4 py-2 rounded-lg ${
                    product.product_type === "Product" ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                >
                  Product
                </button>
                <button
                  onClick={() => setProduct((prev) => ({ ...prev, product_type: "Services" }))}
                  className={`px-4 py-2 rounded-lg ${
                    product.product_type === "Services" ? "bg-blue-500 text-white" : "bg-gray-100"
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
                name="price"
                value={product.price}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                placeholder="Enter price"
              />
              {validationErrors.price && <p className="text-red-500 text-sm">{validationErrors.price}</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button
            className="py-2 px-4 bg-[#FCD301] text-black font-semibold rounded-lg shadow border-2 border-black"
            onClick={handleFormSubmit}
          >
            Save Changes
          </button>
          <button
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
        {responseMessage && <div className="mt-4 text-green-500">{responseMessage}</div>}
        {error && <div className="mt-4 text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default EditProducts;
