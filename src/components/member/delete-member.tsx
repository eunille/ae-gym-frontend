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
import { Member } from "@/models/member";

interface DeletePopupProps {
  isOpen: boolean;
  member: Member;
  onClose: () => void;
  onUpdate: () => void;
}

const DeleteMember: React.FC<DeletePopupProps> = ({
  isOpen,
  member,
  onClose,
  onUpdate,
}) => {
  const { token } = useAuth();

  const handleDeleteConfirmation = async () => {
    if (member) {
      try {
        const apiUrl = `/api/members/${member.id}/`;
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await dataFetch(apiUrl, "DELETE", {}, token);
        console.log("Member deleted:", response);
        onUpdate();
        onClose();
      } catch (error) {
        console.error("Error deleting member:", error);
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
              {member.first_name} {member.last_name}
            </span>{" "}
            from our servers?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} variant={"outline"}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleDeleteConfirmation}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMember;
