import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpDown,
  ArrowUpIcon,
  Eye,
  Trash,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Member } from "@/models/member";
import { toTitleCase } from "@/utils/formatter";

export const memberColumns = (
  onView: (member: Member) => void,
  onDelete: (member: Member) => void,
  onPurchase: (member: Member) => void
): ColumnDef<Member>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          className="inline-flex items-center justify-center text-gray-800 font-semibold hover:text-yellow-500"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Member ID
          {column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-5 w-5" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-5 w-5" />
          ) : (
            <ArrowUpDown className="ml-2 h-5 w-5" />
          )}
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center font-semibold text-gray-800">
        {row.getValue("id")}
      </div>
    ),
  },

  {
    accessorKey: "first_name",
    header: () => (
      <div className="text-center font-semibold text-gray-800">First Name</div>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium text-gray-700">
        {toTitleCase(row.getValue("first_name"))}
      </div>
    ),
  },

  {
    accessorKey: "last_name",
    header: () => (
      <div className="text-center font-semibold text-gray-800">Last Name</div>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium text-gray-700">
        {toTitleCase(row.getValue("last_name"))}
      </div>
    ),
  },

  // {
  //   accessorKey: "membership_type",
  //   header: () => (
  //     <div className="text-center font-semibold text-gray-800">Status</div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="text-center font-medium text-gray-700">
  //       {toTitleCase(row.getValue("membership_type"))}
  //     </div>
  //   ),
  // },

  {
    accessorKey: "purchase",
    header: () => (
      <div className="text-center font-semibold text-gray-800">Purchase</div>
    ),
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="flex justify-center">
          <Button
            className="bg-yellow-400 border-2 border-black text-black p-2 px-4 rounded-full shadow-lg hover:bg-yellow-500 transition-all flex items-center gap-2"
            onClick={() => onPurchase(member)}
          >
            <ShoppingCart className="h-5 w-5" />
            Purchase
          </Button>
        </div>
      );
    },
  },

  {
    accessorKey: "actions",
    header: () => (
      <div className="text-center font-semibold text-gray-800">Actions</div>
    ),
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex justify-center gap-3">
          <Button
            className="bg-black text-white p-2 px-4 rounded-full shadow-lg hover:bg-gray-900 transition-all flex items-center gap-2"
            onClick={() => onView(member)}
          >
            <Eye className="h-5 w-5" />
            View
          </Button>
          <Button
            className="bg-red-500 text-white p-2 px-4 rounded-full shadow-lg hover:bg-red-600 transition-all flex items-center gap-2"
            onClick={() => onDelete(member)}
          >
            <Trash className="h-5 w-5" />
            Delete
          </Button>
        </div>
      );
    },
  },
];
