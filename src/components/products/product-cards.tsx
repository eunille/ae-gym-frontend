import { Product } from "@/models/product";
import { useState } from "react";

interface ProductProps {
  products: Product[];
}

const ProductCards = ({ products }: ProductProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
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
            <button className="py-1 px-4 bg-black text-white rounded-lg hover:bg-gray-900 transition font-semibold">
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCards;
