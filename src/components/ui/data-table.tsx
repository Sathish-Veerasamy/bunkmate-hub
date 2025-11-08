import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Pencil, Trash2, ArrowUpDown, Settings2, Search, Filter, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type FilterOption = {
  label: string;
  value: string;
};

export type DataTableColumn = {
  id: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: "text" | "select";
  filterOptions?: FilterOption[];
  render?: (value: any, row: any) => React.ReactNode;
};

export type DataTableAction = {
  icon: "view" | "edit" | "delete";
  label: string;
  onClick: (row: any) => void;
  variant?: "ghost" | "destructive";
};

interface DataTableProps {
  data: any[];
  columns: DataTableColumn[];
  actions?: DataTableAction[];
  searchableFields?: string[];
  onColumnToggle?: (columns: DataTableColumn[]) => void;
}

export default function DataTable({
  data,
  columns: initialColumns,
  actions = [],
  searchableFields = [],
  onColumnToggle,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columns, setColumns] = useState<DataTableColumn[]>(initialColumns);
  const [fieldFilters, setFieldFilters] = useState<Record<string, string>>({});

  const toggleColumn = (columnId: string) => {
    const updatedColumns = columns.map((col) =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    setColumns(updatedColumns);
    onColumnToggle?.(updatedColumns);
  };

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (columnId: string, value: string) => {
    if (value === "all") {
      const newFilters = { ...fieldFilters };
      delete newFilters[columnId];
      setFieldFilters(newFilters);
    } else {
      setFieldFilters({ ...fieldFilters, [columnId]: value });
    }
  };

  const clearFilter = (columnId: string) => {
    const newFilters = { ...fieldFilters };
    delete newFilters[columnId];
    setFieldFilters(newFilters);
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((row) => {
      // Global search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = searchableFields.some((field) => {
          const value = row[field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
        if (!matchesSearch) return false;
      }

      // Field-specific filters
      for (const [columnId, filterValue] of Object.entries(fieldFilters)) {
        const rowValue = row[columnId];
        if (rowValue === null || rowValue === undefined) return false;
        if (String(rowValue) !== filterValue) return false;
      }

      return true;
    });

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchQuery, sortColumn, sortDirection, searchableFields, fieldFilters]);

  const visibleColumns = columns.filter((col) => col.visible);

  const getActionIcon = (iconType: string) => {
    switch (iconType) {
      case "view":
        return Eye;
      case "edit":
        return Pencil;
      case "delete":
        return Trash2;
      default:
        return Eye;
    }
  };

  const filterableColumns = columns.filter((col) => col.filterable && col.visible);
  const activeFiltersCount = Object.keys(fieldFilters).length;

  return (
    <div className="space-y-4">
      {/* Search and Column Selector */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
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

      {/* Field Filters */}
      {filterableColumns.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {filterableColumns.map((column) => (
              <div key={column.id} className="flex items-center gap-2">
                {column.filterType === "select" && column.filterOptions ? (
                  <div className="flex items-center gap-2">
                    <Select
                      value={fieldFilters[column.id] || "all"}
                      onValueChange={(value) => handleFilterChange(column.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={`Filter by ${column.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All {column.label}</SelectItem>
                        {column.filterOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldFilters[column.id] && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => clearFilter(column.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : column.filterType === "text" ? (
                  <div className="relative">
                    <Input
                      placeholder={`Filter ${column.label}...`}
                      value={fieldFilters[column.id] || ""}
                      onChange={(e) => handleFilterChange(column.id, e.target.value)}
                      className="w-[180px]"
                    />
                    {fieldFilters[column.id] && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-8"
                        onClick={() => clearFilter(column.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {actions.length > 0 && (
                <TableHead className="w-[120px]">Actions</TableHead>
              )}
              {visibleColumns.map((column) => (
                <TableHead key={column.id}>
                  {column.sortable !== false ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 hover:bg-transparent"
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  ) : (
                    <span className="px-4">{column.label}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + (actions.length > 0 ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((row, index) => (
                <TableRow key={row.id || index}>
                  {actions.length > 0 && (
                    <TableCell>
                      <div className="flex gap-2">
                        {actions.map((action, actionIndex) => {
                          const Icon = getActionIcon(action.icon);
                          return (
                            <Button
                              key={actionIndex}
                              variant={action.variant || "ghost"}
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => action.onClick(row)}
                              title={action.label}
                            >
                              <Icon className="h-4 w-4" />
                            </Button>
                          );
                        })}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id}>
                      {column.render
                        ? column.render(row[column.id], row)
                        : row[column.id]?.toString() || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
