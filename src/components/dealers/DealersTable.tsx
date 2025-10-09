import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, ArrowUpDown, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDealers } from "@/store/dealers";

type Column = {
  id: string;
  label: string;
  visible: boolean;
};

interface DealersTableProps {
  searchQuery: string;
  onEdit: (dealer: any) => void;
}

export default function DealersTable({ searchQuery, onEdit }: DealersTableProps) {
  const navigate = useNavigate();
  const { dealers } = useDealers();
  const [sortColumn, setSortColumn] = useState<string>("dealerName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columns, setColumns] = useState<Column[]>([
    { id: "dealerName", label: "Dealer Name", visible: true },
    { id: "dealershipName", label: "Dealership Name", visible: true },
    { id: "contact", label: "Contact", visible: true },
    { id: "email", label: "Email", visible: true },
    { id: "company", label: "Company", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "constitution", label: "Constitution", visible: false },
    { id: "gstNo", label: "GST No", visible: false },
    { id: "address", label: "Address", visible: false },
  ]);

  const toggleColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = dealers.filter((dealer) => {
      const query = searchQuery.toLowerCase();
      return (
        dealer.dealerName.toLowerCase().includes(query) ||
        dealer.dealershipName.toLowerCase().includes(query) ||
        dealer.contact.includes(query) ||
        dealer.email.toLowerCase().includes(query)
      );
    });

    filtered.sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [dealers, searchQuery, sortColumn, sortDirection]);

  const visibleColumns = columns.filter((col) => col.visible);

  return (
    <div className="space-y-4">
      {/* Column Selector */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.visible}
                onCheckedChange={() => toggleColumn(column.id)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Actions</TableHead>
              {visibleColumns.map((column) => (
                <TableHead key={column.id}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 hover:bg-transparent"
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              ))}
              <TableHead>Active Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + 2}
                  className="h-24 text-center"
                >
                  No dealers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((dealer) => (
                <TableRow key={dealer.id}>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => navigate(`/dealers/${dealer.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(dealer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id}>
                      {dealer[column.id as keyof typeof dealer]?.toString()}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Badge
                      variant={dealer.active ? "default" : "secondary"}
                      className={
                        dealer.active
                          ? "bg-success hover:bg-success/90"
                          : ""
                      }
                    >
                      {dealer.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
