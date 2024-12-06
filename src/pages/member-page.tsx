import { memberColumns } from "@/components/columns";
import AddMember from "@/components/member/add-member";
import DeleteMember from "@/components/member/delete-member";
import EditMember from "@/components/member/edit-member";
import MemberTable from "@/components/member/member-table";
import Receipt from "@/components/member/receipt-member";
import Purchase from "@/components/purchase/purchaseModal"; // Import Purchase component
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Member, Membership } from "@/models/member";
import dataFetch from "@/service/data-service";
import decryptionService from "@/service/decryption-service";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

const MembershipPage = () => {
  const { token } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [membership, setMembership] = useState<Membership[]>([]);
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [memberData, setMemberData] = useState<any>(null);
  const [isReceiptOpen, setReceiptOpen] = useState(false);

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isPurchasePopupOpen, setIsPurchasePopupOpen] = useState(false); 
  const [selectedMember, setSelectedMember] = useState<Member>();
  

  const fetchMembers = async () => {
    try {
      const encryptedMembers = (await dataFetch(
        "api/members/",
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

      const members = decryptionService(secret, encryptedMembers)


      setMembers(members);
    } catch (error) {
      console.error("Failed to fetch suppliers", error);
    }
  };

  const fetchMembershipType = async () => {
    try {
      const membership = (await dataFetch(
        "api/memberships/",
        "GET",
        {},
        token!
      )) as Membership[];
      setMembership(membership);
      console.log("Membership fetched", membership);
    } catch (error) {
      console.error("Failed to fetch suppliers", error);
    }
  };

  

  const handleExport = async()=> {
    try {
      const response = await dataFetch(
        "api/excel/members/",
        "GET",
        {},
        token!,
        "blob"
      );

      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);

      window.open(url);
    } catch (error) {
      console.error("Failed to fetch Excel file", error);
    }
  };

  const handleAddMemberSubmit = (data: any) => {
    setMemberData(data);
    setIsAddMemberPopupOpen(false);
    setReceiptOpen(true);
  };

  const handleReceiptClose = () => {
    setReceiptOpen(false);
    setMemberData(null);
  };

  const handleView = (member: Member) => {
    setSelectedMember(member);
    setIsEditPopupOpen(true);
  };

  const handleDelete = (member: Member) => {
    setSelectedMember(member);
    setIsDeletePopupOpen(true);
  };

  const handlePurchase = (member: Member) => {
    setSelectedMember(member);
    setIsPurchasePopupOpen(true); 
  };

  const handlePurchaseSubmit = (data: any) => {
    console.log("Purchase submitted with data:", data);
    setIsPurchasePopupOpen(false); 
  };

  const memberColumn = memberColumns(handleView, handleDelete, handlePurchase); 

  useEffect(() => {
    fetchMembershipType();
    fetchMembers();
  }, []);

  return (
    <main className="w-full h-screen p-3.5 relative">
      <div className="self-end absolute z-50 right-10 top-12">
        <Button
          className="bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-800 flex items-center gap-2"
          onClick={() => setIsAddMemberPopupOpen(true)}
        >
          <UserPlus className="text-white" />
          <span>Add Member</span>
        </Button>
        <Button
          className="bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-800 flex items-center gap-2"
          onClick={() => handleExport()}
        >
          <UserPlus className="text-white" />
          <span>Export</span>
        </Button>
      </div>
      <div className="sm:pl-48 ">
        <MemberTable
          columns={memberColumn}
          onEdit={handleView}
          onDelete={handleDelete}
          data={members}
        />
      </div>

      {isAddMemberPopupOpen && (
        <AddMember
          onSubmit={handleAddMemberSubmit}
          isOpen={isAddMemberPopupOpen}
          onClose={() => setIsAddMemberPopupOpen(false)}
        />
      )}

      {isReceiptOpen && (
        <Receipt
          onClose={handleReceiptClose}
          memberData={memberData}
          onUpdate={fetchMembers}
          onConfirm={() => setReceiptOpen(false)}
        />
      )}

      {isDeletePopupOpen && (
        <DeleteMember
          isOpen={isDeletePopupOpen}
          member={selectedMember!}
          onClose={() => setIsDeletePopupOpen(false)}
          onUpdate={fetchMembers}
        />
      )}

      {isEditPopupOpen && (
        <EditMember
          callback={fetchMembers}
          onClose={() => setIsEditPopupOpen(false)}
          isOpen={isEditPopupOpen}
          selectedMemberData={selectedMember!}
        />
      )}

      {isPurchasePopupOpen && (
        <Purchase
          onClosePurchase={() => setIsPurchasePopupOpen(false)}
          isOpenPurchase={isPurchasePopupOpen}
          onSubmitPurchase={handlePurchaseSubmit}
          selectedMember={selectedMember!} 
        />
      )}
    </main>
  );
};

export default MembershipPage;
