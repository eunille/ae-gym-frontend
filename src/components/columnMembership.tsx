import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpDown,
  ArrowUpIcon,
  Eye,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Member } from "@/models/member";
import { toTitleCase } from "@/utils/formatter";
import { Membership } from "@/models/member";



export const columnMembership = (
  onView: (member: Member) => void,
  onPurchase: (member: Member) => void,

): ColumnDef<Member>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant={"ghost"}
            className="inline-flex items-center justify-center text-black font-bold "
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
    accessorKey: "membership_type",
    header: () => (
      <div className="text-center  font-bold text-black">Membership Type</div>
    ),
    cell: ({ row }) => {
      const membership_type: string = row.getValue("membership_type");

      return (
        <div className="text-center   font-medium text-black">
          {toTitleCase(membership_type)}
        </div>
      );
    },
  },

 {
    accessorKey: "purchase",
    header: () => (
      <div className="text-center font-bold text-black">Purchase Membership</div>
    ),
    cell: ({ row }) => {
      const member = row.original; 
      return (
        <div className="flex justify-center">
          <Button
            className="bg-[#FCD301] w-24 border-2 border-black text-black px-4 py-2 rounded-md shadow-md flex items-center gap-2 hover:text-white"
            onClick={() => onPurchase(member)} 
          >
            Purchase 
          </Button>
        </div>
      );
    },
  },

  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex gap-2.5">
          
          
        </div>
      );
    },
  },
];
