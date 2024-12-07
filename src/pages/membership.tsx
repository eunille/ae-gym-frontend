import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import MembershipTable from "@/components/membership/membershipTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import dataFetch from "@/service/data-service";
import { Member } from "@/models/member";

const Membership: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [columns] = useState<ColumnDef<Member, any>[]>([
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "first_name",
      header: "First Name",
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
    },
    {
      accessorKey: "membership_type",
      header: "Membership Type",
    },
    {
      accessorKey: "join_date",
      header: "Join Date",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            Renew
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.original)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]);

  useEffect(() => {
    // Fetch members data from API
    dataFetch("/api/members", "GET")
      .then((data) => setMembers(data))
      .catch((error) => console.error("Failed to fetch members:", error));
  }, []);

  const handleEdit = (member: Member) => {
    console.log("Renew member:", member);
    // Add edit functionality here
  };

  const handleDelete = (member: Member) => {
    console.log("Delete member:", member);

  };

  return (
    <main className="w-full h-screen p-3.5 relative">
      <div className="flex gap-4 self-end absolute z-50 right-10 top-12">
        <Button
          className="bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-800 flex items-center gap-2"

        >
          <UserPlus className="text-white" />
          <span>Add Membership</span>
        </Button>
        <Button
          className="bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-800 flex items-center gap-2"
         
        >
          <UserPlus className="text-white" />
          <span>Export</span>
        </Button>
      </div>
      <div className="sm:pl-48 ">
       <MembershipTable
            columns={columns}
            data={members}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
      </div>

     
    </main>
  );
};

export default Membership
