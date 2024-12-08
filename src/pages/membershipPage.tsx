import { columnMembership } from "@/components/columnMembership";

import DeleteMember from "@/components/member/delete-member";
import EditMember from "@/components/member/edit-member";

import Receipt from "@/components/member/receipt-member";
import MembershipTable from "@/components/membership/membershipTable";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Member } from "@/models/member";
import dataFetch from "@/service/data-service";
import decryptionService from "@/service/decryption-service";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import PurchaseMembership from "@/components/membership/purchaseMembership";

const MembershipPage = () => {
  const { token } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [memberData, setMemberData] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<Member>();
  
  
  const [isPurchasePopupOpen, setIsPurchasePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  

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

 

  

  

 

 
 

  const handleView = (member: Member) => {
    setSelectedMember(member);
    setIsEditPopupOpen(true);
  };

 

  const handlePurchase = (member: Member) => {
    setSelectedMember(member);
    setIsPurchasePopupOpen(true);
    
   
  };

 

  const membershipColumn = columnMembership(handleView,handlePurchase); 

  useEffect(() => {
  
    fetchMembers();
  }, []);

  return (
    <main className="w-full h-screen p-3.5 relative">
      <div className="flex gap-4 self-end absolute z-50 right-10 top-12">
       
      
      </div>
      <div className="sm:pl-48 ">
        <MembershipTable
          columns={membershipColumn}
          onEdit={handleView}
          data={members}
          
        />
      </div>
      
      <PurchaseMembership
        isOpen={isPurchasePopupOpen}
        onClose={() => setIsPurchasePopupOpen(false)}
        fetchMembership={fetchMembers}
        selectedMember={selectedMember!} 
      />
     
    </main>
  );
};

export default MembershipPage;


{"Notes:MembershipTable,ColumnMembership,MembershipPage"}