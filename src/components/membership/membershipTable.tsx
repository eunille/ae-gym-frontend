import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { Member } from "@/models/member";

interface MembershipTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; 
  data: TData[]; 
  onEdit: (member: Member) => void; 
  
}

const MembershipTable = ({ columns, data }: MembershipTableProps<Member, any>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedSort, setSelectedSort] = useState("All Members");
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },

    
    debugTable: true,

    // Global search filter
    globalFilterFn: (row, columnId, filterValue) => {
      const id = String(row.original.id || "").toLowerCase();
      const firstName = String(row.original.first_name || "").toLowerCase();
      const lastName = String(row.original.last_name || "").toLowerCase();

      return (
        id.startsWith(filterValue.toLowerCase()) ||
        firstName.startsWith(filterValue.toLowerCase()) ||
        lastName.startsWith(filterValue.toLowerCase())
      );
    },

    filterFns: {
      statusFilter: (row, columnId, filterValue) => {
        const status = row.original.status?.toLowerCase();
        return status === filterValue.toLowerCase();
      },
      membershipTypeFilter: (row, columnId, filterValue) => {
        const membershipType = row.original.membership_type?.toLowerCase();
        return membershipType === filterValue.toLowerCase();
      },
    },
  });

  
  console.log("Column Filters:", columnFilters);
  console.log("Filtered Rows:", table.getRowModel().rows);

  const handleSortChange = (sortType: string) => {
    setSelectedSort(sortType);

    if (sortType === "Daily") {
      setColumnFilters([{ id: "membership_type", value: "Daily" }]);
    } else if (sortType === "Monthly") {
      setColumnFilters([{ id: "membership_type", value: "Monthly" }]);
    } else {
      setColumnFilters([]); 
    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);

    if (status === "Active") {
      setColumnFilters([{ id: "status", value: "Active" }]);
    } else if (status === "Expired") {
      setColumnFilters([{ id: "status", value: "Expired" }]);
    } else {
      setColumnFilters([]); 
    }
  };

  return (
    <div className="relative z-10 border-2 border-gray-300 p-5 shadow-md rounded-md min-h-[70%] h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex w-full justify-start item-center my-2.5 gap-2">
          {/* Search Input */}
          <Input
            placeholder="Search member..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm rounded-md border border-gray-400"
          />

          {/* Dropdown to filter by membership type */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full">
                <span>{selectedSort}</span>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["All Members", "Daily", "Monthly"].map((sortType) => (
                <DropdownMenuItem
                  key={sortType}
                  onClick={() => handleSortChange(sortType)}
                >
                  {sortType}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown to filter by status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full">
                <span>{selectedStatus}</span>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["All Status", "Active", "Expired"].map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <Table className="mb-14 h-fit">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                onClick={() => row.getToggleSelectedHandler()}
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : ""}
                className="cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <span>No Member Found.</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembershipTable;
