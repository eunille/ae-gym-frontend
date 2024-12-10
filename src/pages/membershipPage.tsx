import { columnMembership } from "@/components/columnMembership";
import DeleteMember from "@/components/member/delete-member";
import EditMember from "@/components/member/edit-member";
import Receipt from "@/components/member/receipt-member";
import MembershipTable from "@/components/membership/membershipTable";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Member, Membership } from "@/models/member";
import dataFetch from "@/service/data-service";
import decryptionService from "@/service/decryption-service";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import PurchaseMembership from "@/components/membership/membershipPurchase";
import MemberPrice from "@/components/membershipPrice/memberPrice";
import MembershipReceipt from "@/components/membership/membershipReceipt";

const MembershipPage = () => {
  const { token } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isPurchasePopupOpen, setIsPurchasePopupOpen] = useState(false);
  const [isMemberPricePopupOpen, setIsMemberPricePopupOpen] = useState(false);
  const [dailyPrice, setDailyPrice] = useState<number>(0);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(0);
  const [membershipReceipt, setMembershipReceipt] = useState(false);

  
  const fetchMembers = async () => {
    try {
      const encryptedMembers = await dataFetch("api/members/", "GET", {}, token!);
      const secret = await dataFetch("api/secret-key/", "GET", {}, token!);
      const members = decryptionService(secret, encryptedMembers);
      setMembers(members);
    } catch (error) {
      console.error("Failed to fetch members", error);
    }
  };

  const fetchMemberPrice = async () => {
    try {
      const response = await dataFetch("api/memberships/", "GET", {}, token!);
      const secret = await dataFetch("api/secret-key/", "GET", {}, token!);
      const decryptedMemberships = decryptionService(secret, response);

      const dailyMembership = decryptedMemberships.find((m: Membership) => m.membership_type === "Daily");
      const monthlyMembership = decryptedMemberships.find((m: Membership) => m.membership_type === "Monthly");

      if (dailyMembership) setDailyPrice(dailyMembership.price);
      if (monthlyMembership) setMonthlyPrice(monthlyMembership.price);
      console.log("Decrypted Memberships fetched", decryptedMemberships);
    } catch (error) {
      console.error("Failed to fetch membership prices", error);
    }
  };

  

  const handleExport = async()=> {
    try {
      const response = await dataFetch(
        "api/excel/members/",
        "GET",
        {},
        token!,
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
    fetchMemberPrice();
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
        dailyPrice={dailyPrice}  
        monthlyPrice={monthlyPrice}  
       
      />

    </main>
  );
};

export default MembershipPage;


{"Notes:MembershipTable,ColumnMembership,MembershipPage"}

function setIsEditPopupOpen(arg0: boolean) {
  throw new Error("Function not implemented.");
}
