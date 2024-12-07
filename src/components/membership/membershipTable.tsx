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

   onPurchase: (member: Member) => void,
}

const MembershipTable= ({ columns, data }: MembershipTableProps<Member, any>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedSort, setSelectedSort] = useState("All Members");
  const [selectedStock, setSelectedMember] = useState<Member | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

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

    // Global filtering meaning that it will search for the value in all columns
    globalFilterFn: (row, columnId, filterValue) => {
      const id = String(row.original.id || "").toLowerCase();
      const firstName = String(row.original.first_name || "").toLowerCase();
      const lastName = String(row.original.last_name || "").toLowerCase();

      console.log(columnId);

      return (
        id.startsWith(filterValue.toLowerCase()) ||
        firstName.startsWith(filterValue.toLowerCase()) ||
        lastName.startsWith(filterValue.toLowerCase())
      );
    },
  });

  console.log(selectedStock);

  const handleSortChange = (sortType: string) => {
    setSelectedSort(sortType);

    switch (sortType) {
      case "Daily":
        setColumnFilters([
          {
            id: "membership_type",
            value: "Daily",
          },
        ]);
        break;
      case "Monthly":
        setColumnFilters([
          {
            id: "membership_type",
            value: "Monthly",
          },
        ]);
        break;
      default:
        setColumnFilters([]);
        break;
    }
  };

  return (
    <div className="relative z-10 border-2 border-gray-300 p-5 shadow-md rounded-md min-h-[70%] h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex w-full justify-start item-center my-2.5 gap-2">
          {/* check nyo nlng if tama ung sa Search */}
          <Input
            placeholder="Search member..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm rounded-md border border-gray-400"
          />
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
        </div>
      </div>
      <Table className="mb-14 h-fit">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                onClick={() => setSelectedMember(row.original as Member)}
                key={row.id}
                data-state={row.getIsSelected()}
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
