import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpDown,
  ArrowUpIcon,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Member, MembershipTransaction, Transac } from "@/models/member";
import { toTitleCase } from "@/utils/formatter";

export const columnMembership = (
  onView: (member: Member) => void,
  onPurchase: (member: Member) => void
): ColumnDef<Member>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="inline-flex items-center justify-center text-gray-800 font-semibold hover:text-yellow-500"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Member ID
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center  font-bold text-black">
          {row.getValue("id")}
        </div>
      );
    },
  },

  {
    accessorKey: "first_name",
    header: () => (
      <div className="text-center font-bold text-black">First Name</div>
    ),
    cell: ({ row }) => {
      const first_name: string = row.getValue("first_name");

      return (
        <div className="text-center font-medium text-black">
          {toTitleCase(first_name)}
        </div>
      );
    },
  },

  {
    accessorKey: "last_name",
    header: () => (
      <div className="text-center  font-bold text-black">Last Name</div>
    ),
    cell: ({ row }) => {
      const last_name: string = row.getValue("last_name");

      return (
        <div className="text-center   font-medium text-black">
          {toTitleCase(last_name)}
        </div>
      );
    },
  },

  {
    accessorKey: "membershipType",
    header: () => (
      <div className="text-center font-bold text-black">Membership Type</div>
    ),
    cell: ({ row }) => {
      const membershipType: string | null = row.getValue("membershipType");
      const isExpired: boolean = row.original.isExpired; 
  
      return (
        <div className="text-center font-medium text-black">
        
          {isExpired ? "No Transaction" : membershipType || "N/A"}
        </div>
      );
    },
  },
  

  {
    accessorKey: "latestTransactionDate",
    header: () => (
      <div className="text-center font-bold text-black">Expiry Date</div>
    ),
    cell: ({ row }) => {
      const registeredAt: string | null = row.getValue("latestTransactionDate");
      const membershipType: string | null = row.getValue("membershipType"); 
      const isExpired: boolean = row.original.isExpired; 
  
      const date = registeredAt ? new Date(registeredAt) : null;
      const isValidDate = date instanceof Date && !isNaN(date.getTime());
  
      let expirationDate: string | null = null;
      if (isValidDate && !isExpired) {
        const expDate = new Date(date);
  
        if (membershipType?.toLowerCase() === "monthly") {
          expDate.setDate(expDate.getDate() + 30);
        } else if (membershipType?.toLowerCase() === "daily") {
          expDate.setHours(expDate.getHours() + 24);
        } else {
          expDate.setFullYear(expDate.getFullYear() + 1); 
        }
  
        expirationDate = expDate.toLocaleString();
      }
  
      return (
        <div className={`text-center font-medium ${expirationDate ? 'text-red-500' : 'text-black'}`}>
          <div>{isExpired || !isValidDate ? "No Expiry" : expirationDate}</div>
        </div>
      );
    },
  },
  
  
  

  {
    accessorKey: "status",
    header: () => (
      <div className="text-center font-bold text-black">Status</div>
    ),
    cell: ({ row }) => {
      const isExpired: boolean = row.original.isExpired;
  
      return (
        <div
          className={`text-center font-medium ${
            isExpired ? "text-red-500" : "text-green-500"
          }`}
        >
          {isExpired ? "No Subcription" : "Active"}
        </div>
      );
    },
  },

  {
    accessorKey: "purchase",
    header: () => (
      <div className="text-center font-bold text-black">
        Purchase Membership
      </div>
    ),
    cell: ({ row }) => {
      const member = row.original;
      const isExpired = member.isExpired;
      return (
        <div className="flex justify-center">
          <Button
            className={`bg-yellow-400 border-2 border-black text-black p-2 px-4 rounded-full shadow-lg hover:bg-yellow-500 transition-all flex items-center gap-2 ${
              isExpired ? "" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => isExpired && onPurchase(member)}
            disabled={!isExpired}
          >
            <ShoppingCart className="h-5 w-5" />
            Purchase
          </Button>
        </div>
      );
    },
  },
];
