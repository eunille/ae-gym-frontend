import { memberColumns } from "@/components/columns";
import AddMember from "@/components/member/add-member";
import DeleteMember from "@/components/member/delete-member";
import EditMember from "@/components/member/edit-member";
import MemberTable from "@/components/member/member-table";
import Purchase from "@/components/purchase/purchaseModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Member } from "@/models/member";
import dataFetch from "@/service/data-service";
import decryptionService from "@/service/decryption-service";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import PurchaseReceipt from "@/components/purchase/purchaseReceipt";

const MemberPage = () => {
  const { token } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);

  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [memberData, setMemberData] = useState<any>(null);
  const [isReceiptOpen, setReceiptOpen] = useState(false);

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isPurchasePopupOpen, setIsPurchasePopupOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member>();
  const [isPurchaseReceiptPopupOpen, setIsPurchaseReceiptPopupOpen] = useState(false);
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const [purchase,setPurchase] = useState<any>(null);

 

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
      console.error("Failed to fetch members", error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const encryptedpurchases = (await dataFetch(
        "api/purchases/",
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

      const purchases = decryptionService(secret, encryptedpurchases)

      setPurchase(purchases);
      console.log(purchases);
    } catch (error) {
      console.error("Failed to fetch purchases", error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await dataFetch("api/excel/members/", "GET", {}, token!, "blob");
      const url = window.URL.createObjectURL(new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  
      const a = Object.assign(document.createElement("a"), { href: url, download: "members.xlsx" });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
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
    setPurchaseData(data); 
  
    setIsPurchasePopupOpen(false);
    
    
    setIsPurchaseReceiptPopupOpen(true); 
  };

  const memberColumn = memberColumns(handleView, handleDelete, handlePurchase);

  useEffect(() => {
    fetchMembers();
    fetchPurchases();
  }, []);

  return (
    <main className="w-full h-screen p-3.5 relative ">
      <div className="flex gap-4 self-end absolute z-50 right-10 top-12">
        <Button
          className="bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-800 flex items-center gap-2"
          onClick={() => setIsAddMemberPopupOpen(true)}
        >
          <UserPlus className="text-white" />
          <span>Add Member</span>
        </Button>
       
      </div>
      <div className="sm:pl-48  ">
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
          callback = {fetchMembers}
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
          openReceipt={() => setIsPurchaseReceiptPopupOpen(true)}
          data={setPurchaseData}

        />
      )}

      {isPurchaseReceiptPopupOpen && (
        <PurchaseReceipt
          onClose={() => setIsPurchaseReceiptPopupOpen(false)}
          isReceiptOpen={isPurchaseReceiptPopupOpen}
          purchaseData={purchaseData}
          member={selectedMember!}
        />
      )}
    </main>
  );
};

export default MemberPage;