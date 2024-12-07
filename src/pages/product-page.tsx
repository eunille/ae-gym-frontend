import ProductCards from "@/components/products/product-cards";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Product } from "@/models/product";
import dataFetch from "@/service/data-service";
import  { useEffect, useState } from "react";
import AddProducts from "@/components/products/addProducts";
import MemberPrice from "@/components/membershipPrice/memberPrice";
import decryptionService from "@/service/decryption-service";


const ProductPage = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMemberPrice, setIsOpenMemberPrice] = useState(false); 

  const fetchProducts = async () => {
    console.log("fetchingProducts");
    try {
      const encryptedProducts =(await dataFetch(
        "api/products/",
         "GET",
          {},
          token!
        ));
      
      const secret = (await dataFetch(
        "api/secret-key/",
        "GET",
        {},
        token!
      ));

      const products = decryptionService(secret, encryptedProducts)

      setProducts(products);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

 useEffect(() => {
    fetchProducts();

  }, []);

  


  
  return (
    <main className="w-full h-screen p-3.5 relative">
      <div className="sm:pl-48">
        <div className="flex w-full justify-between items-center gap-2.5 border-b border-black pb-3">
          <h2 className="text-2xl font-bold text-gray-800">Pricing</h2>
          <div className="flex w-full items-center justify-end gap-2.5">
            <Button
              className="bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-800 flex items-center gap-2"
              onClick={() => setIsOpen(true)}
            >
              Add Product
            </Button>
            <Button
              className="py-2 px-4 bg-[#FCD301] text-black font-semibold rounded-lg shadow border-2 border-black"
              onClick={() => setIsOpenMemberPrice(true)} 
            >
              Membership Price
            </Button>
          </div>
        </div>
        <div className="mt-5">
          <ProductCards products={products} 
          callback={fetchProducts}/>
        </div>
      </div>

      <AddProducts
        fetchProduct={fetchProducts}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        
      />
    </main>
  );
};

export default ProductPage;
