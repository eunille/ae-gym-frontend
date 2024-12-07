import { Product } from "@/models/product";
import { useState, useEffect } from "react";
import EditProducts from "./editProducts";
import { useAuth } from "@/context/auth-context";
import dataFetch from "@/service/data-service";
import { Delete } from "lucide-react";
import DeleteProducts from "./deleteProducts";

interface ProductProps {
  products: Product[];
}

const ProductCards = ({ products }: ProductProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [updatedProducts, setUpdatedProducts] = useState<Product[]>(products);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();
  const fetchUpdatedProducts = async () => {
    const url = "http://127.0.0.1:8000/api/products/";
    if (!token) {
      alert("Authentication token is missing!");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const fetchedProducts = await response.json();
        setUpdatedProducts(fetchedProducts);
        console.log("Products data fetched:", fetchedProducts);
      } else {
        const errorResponse = await response.json();
        console.error("Failed to fetch products:", errorResponse);
        setError(
          errorResponse.detail || "Failed to fetch products. Please try again."
        );
      }
    } catch (error) {
      console.error("An error occurred while fetching products:", error);
      setError("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    setUpdatedProducts(products);
    console.log("Products data fetched:", products);
  }, [products]);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCallback = () => {
    handleCloseModal();
    fetchUpdatedProducts();
  };

  return (
    <div>
      {error && <div className="text-red-500">Error: {error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {updatedProducts.map((product) => (
          <div
            key={product.id}
            className="relative p-4 bg-white border-2 border-black rounded-lg shadow-sm"
          >
            <span className="absolute -top-1 -left-1 bg-[#FCD301] text-black py-2 px-3 text-md rounded-br-lg rounded-tl-lg font-semibold border-2 border-black">
              {product.name}
            </span>
            <div className="w-full h-32 mb-4 flex items-center justify-center">
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="object-contain h-full rounded-md"
              />
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="text-xl font-bold text-gray-900">
                  ₱{product.price}
                </p>
              </div>
              <button
                className="py-1 px-4 bg-black text-white rounded-lg hover:bg-gray-900 transition font-semibold"
                onClick={() => handleEditClick(product)}
              >
                Edit
              </button>
              <button
                className="py-1 px-4 bg-red-500 text-white rounded-lg hover:bg-red-900 transition font-semibold"
                onClick={() => handleDeleteClick(product)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <EditProducts
          onClose={handleCloseModal}
          isOpen={isModalOpen}
          selectedProductData={selectedProduct}
          callback={handleCallback}
        />
      )}

      {selectedProduct && (
        <DeleteProducts
          isOpen={isDeleteOpen}
          product={selectedProduct!}
          onClose={handleCloseModal}
          onUpdate={fetchUpdatedProducts}
        />
      )}
    </div>
  );
};

export default ProductCards;
