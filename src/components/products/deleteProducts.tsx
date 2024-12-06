import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/auth-context";
import dataFetch from "@/service/data-service";
import { Product } from "@/models/product";

interface DeletePopupProps {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
  onUpdate: () => void;
}

const DeleteProducts: React.FC<DeletePopupProps> = ({
  isOpen,
  product,
  onClose,
  onUpdate,
}) => {
  const { token } = useAuth();

  const handleDeleteConfirmation = async () => {
    if (product) {
      try {
        const apiUrl = `/api/products/${product.id}/`;
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await dataFetch(apiUrl, "DELETE", {}, token);
        console.log("product deleted:", response);
        onUpdate();
        onClose();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-500">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription className="text-gray-800">
            This action cannot be undone. Are you sure you want to permanently
            delete{" "}
            <span className="font-semibold">
                {product.name}
            </span>{" "}
            from our servers?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" onClick={handleDeleteConfirmation}>
            Confirm
          </Button>
          <Button onClick={onClose} variant={"outline"}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProducts;


