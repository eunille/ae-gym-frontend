import { Product } from "@/models/product";
import { useState, useEffect } from "react";
import EditProducts from "./editProducts";
import { useAuth } from "@/context/auth-context";
import dataFetch from "@/service/data-service";
import DeleteProducts from "./deleteProducts";
import decryptionService from "@/service/decryption-service";

interface ProductProps {
  products: Product[];
  callback: () => void;
}

const ProductCards = ({ products, callback }: ProductProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [updatedProducts, setUpdatedProducts] = useState<Product[]>(products);
  const [error, setError] = useState<string | null>(null);
  console.log(products);

  const { token } = useAuth();

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true); 
    setIsDeleteOpen(false);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true); 
    setIsModalOpen(false); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsDeleteOpen(false); 
    setSelectedProduct(null);
  };

  return (
    <div>
      {error && <div className="text-red-500">Error: {error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
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
                <div className="flex items-center justify-end gap-6  pt-4">
                  <button
                    className="py-1 px-5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 border-2 border-transparent hover:border-black focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="py-1 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 border-2 border-transparent hover:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => handleDeleteClick(product)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No products available.</div>
        )}
      </div>

      {selectedProduct && (
        <EditProducts
          onClose={handleCloseModal}
          isOpen={isModalOpen}
          selectedProductData={selectedProduct}
          callback={callback}
        />
      )}

      {selectedProduct && (
        <DeleteProducts
          isOpen={isDeleteOpen}
          product={selectedProduct}
          onClose={handleCloseModal}
          onUpdate={callback}
        />
      )}
    </div>
  );
};

export default ProductCards;
