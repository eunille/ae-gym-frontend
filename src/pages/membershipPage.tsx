import { columnMembership } from "@/components/columnMembership";
import DeleteMember from "@/components/member/delete-member";
import EditMember from "@/components/member/edit-member";
import MembershipTable from "@/components/membership/membershipTable";
import { useAuth } from "@/context/auth-context";
import {
  Member,
  Membership,
  MembershipTransaction,
  Transac,
} from "@/models/member";
import dataFetch from "@/service/data-service";
import decryptionService from "@/service/decryption-service";
import { useEffect, useState } from "react";
import PurchaseMembership from "@/components/membership/membershipPurchase";

const MembershipPage = () => {
  const { token } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [type, setType] = useState<Membership[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isPurchasePopupOpen, setIsPurchasePopupOpen] = useState(false);
  const [isMemberPricePopupOpen, setIsMemberPricePopupOpen] = useState(false);
  const [dailyPrice, setDailyPrice] = useState<number>(0);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(0);
  const [membershipReceipt, setMembershipReceipt] = useState(false);
  const [membershipTransaction, setMembershipTransaction] = useState<Transac[]>([]);
  const [membershipType, setMembershipType] = useState<Membership[]>([]);
  const [mockDate, setMockDate] = useState<Date | null>(null); // New state for mock date

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

      const dailyMembership = decryptedMemberships.find(
        (m: Membership) => m.membership_type === "Daily"
      );
      const monthlyMembership = decryptedMemberships.find(
        (m: Membership) => m.membership_type === "Monthly"
      );

      if (dailyMembership) setDailyPrice(dailyMembership.price);
      if (monthlyMembership) setMonthlyPrice(monthlyMembership.price);
    } catch (error) {
      console.error("Failed to fetch membership prices", error);
    }
  };

  const fetchMemberTransactions = async () => {
    try {
      const encryptedTransactions = await dataFetch("api/membership-transactions/", "GET", {}, token!);
      const secret = await dataFetch("api/secret-key/", "GET", {}, token!);
      const decryptedTransactions: Transac[] = decryptionService(secret, encryptedTransactions);
      setMembershipTransaction(decryptedTransactions);
    } catch (error) {
      console.error("Failed to fetch membership transactions", error);
    }
  };

  const fetchMembershipType = async () => {
    try {
      const response = await dataFetch("api/memberships/", "GET", {}, token!);
      const secret = await dataFetch("api/secret-key/", "GET", {}, token!);
      const decryptedMemberships = decryptionService(secret, response);
      setMembershipType(decryptedMemberships);
      setType(decryptedMemberships);
    } catch (error) {
      console.error("Failed to fetch membership types", error);
    }
  };

  const combineData = () => {
    return members.map((member) => {
      const transactions = membershipTransaction.filter(
        (t) => t.member === member.id
      );

      const sortedTransactions = transactions.sort(
        (a, b) =>
          new Date(b.registered_at).getTime() - new Date(a.registered_at).getTime()
      );

      const latestTransaction = sortedTransactions[0];

      const membershipType = latestTransaction
        ? type.find((m) => m.id === latestTransaction.membership)
            ?.membership_type || "N/A"
        : "N/A";

      const currentDate = mockDate || new Date(); // Use mock date or real date
      let isExpired = true;
      let remainingTime = "N/A";

      if (latestTransaction) {
        const membershipType = type.find(
          (m) => m.id === latestTransaction.membership
        )?.membership_type;

        const registeredAt = new Date(latestTransaction.registered_at);
        let expiryDate: Date | null = null;

        if (membershipType === "Monthly") {
          expiryDate = new Date(registeredAt.setDate(registeredAt.getDate() + 30));
        } else if (membershipType === "Daily") {
          expiryDate = new Date(registeredAt.setDate(registeredAt.getDate() + 1));
        }

        isExpired = expiryDate ? currentDate > expiryDate : true;

        if (expiryDate && !isExpired) {
          const remainingTimeInMilliseconds = expiryDate.getTime() - currentDate.getTime();
          const remainingTimeInMinutes = Math.floor(remainingTimeInMilliseconds / 60000);
          const remainingHours = Math.floor(remainingTimeInMinutes / 60);
          const remainingDays = Math.floor(remainingHours / 24);

          remainingTime = `${remainingDays} days, ${remainingHours % 24} hours, ${remainingTimeInMinutes % 60} minutes`;
        }
      }

      console.log(`Member: ${member.first_name} ${member.last_name}, Remaining Time: ${remainingTime}`);

      return {
        ...member,
        membershipType,
        isExpired,
        latestTransactionDate: latestTransaction?.registered_at || "N/A",
        transactions: sortedTransactions,
        remainingTime,
        hasActiveMembership: !isExpired,
      };
    });
  };

  const handleExport = async () => {
    try {
      const response = await dataFetch("api/excel/members/", "GET", {}, token!);

      if (response instanceof ArrayBuffer || response instanceof Blob) {
        const blob = new Blob([response], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "members.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        console.error(
          "Failed to export: The response is not binary data (ArrayBuffer or Blob)."
        );
      }
    } catch (error) {
      console.error("Failed to fetch Excel file:", error);
    }
  };

  const handleView = (member: Member) => {
    setSelectedMember(member);
    setIsEditPopupOpen(true);
  };

  const handlePurchase = (member: Member) => {
    const memberData = combineData().find((m) => m.id === member.id);

    if (!memberData) {
      alert("Member not found.");
      return;
    }

    if (memberData.hasActiveMembership) {
      alert("Member already has an active membership and cannot purchase again.");
      return;
    }

    setSelectedMember(member);
    setIsPurchasePopupOpen(true);
  };

  const membershipColumn = columnMembership(handleView, handlePurchase);

  useEffect(() => {
    const fetchData = async () => {
      await fetchMembers();
      await fetchMemberPrice();
      await fetchMembershipType();
      await fetchMemberTransactions();
    };
    fetchData();
  }, []);

  return (
    <main className="w-full h-screen p-3.5 relative">
      <div className="flex gap-4 self-end absolute z-50 right-10 top-12">
        <label htmlFor="mock-date">Mock Date: </label>
        <input
          id="mock-date"
          type="datetime-local"
          step="1"
          onChange={(e) => setMockDate(new Date(e.target.value))}
        />
        <button onClick={() => setMockDate(null)}>Reset Mock Date</button>
      </div>
      <div className="sm:pl-48">
        <MembershipTable
          columns={membershipColumn}
          onEdit={handleView}
          data={combineData()}
        />
      </div>

      <PurchaseMembership
        isOpen={isPurchasePopupOpen}
        onClose={() => setIsPurchasePopupOpen(false)}
        fetchMembership={fetchMembers}
        selectedMember={selectedMember!}
        membershipTypes={membershipType}
        onPurchaseSuccess={() => {
          fetchMembers();
          fetchMemberTransactions();
        }}
      />
    </main>
  );
};

export default MembershipPage;

function setIsEditPopupOpen(arg0: boolean) {
  throw new Error("Function not implemented.");
}
