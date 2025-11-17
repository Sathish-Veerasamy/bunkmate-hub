import { useState, useMemo, useRef } from "react";
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
import { Eye, Pencil, Trash2, ArrowUpDown, Settings2, Search, Filter, X, Plus, Download, Upload, ChevronLeft, ChevronRight } from "lucide-react";
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
  onImport?: (data: any[]) => void;
  exportFileName?: string;
}

export default function DataTable({
  data,
  columns: initialColumns,
  actions = [],
  searchableFields = [],
  onColumnToggle,
  onImport,
  exportFileName = "export",
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columns, setColumns] = useState<DataTableColumn[]>(initialColumns);
  const [fieldFilters, setFieldFilters] = useState<Record<string, string>>({});
  const [selectedFilterField, setSelectedFilterField] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (value === "all" || value === "") {
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

  const addFilter = () => {
    if (selectedFilterField && !fieldFilters[selectedFilterField]) {
      setFieldFilters({ ...fieldFilters, [selectedFilterField]: "" });
      setSelectedFilterField("");
    }
  };

  const getColumnById = (columnId: string) => {
    return columns.find(col => col.id === columnId);
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

  const filterableColumns = columns.filter((col) => col.filterable);
  const activeFilters = Object.entries(fieldFilters);
  const availableFilterColumns = filterableColumns.filter(
    col => !fieldFilters.hasOwnProperty(col.id)
  );

  // Pagination
  const totalRecords = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterOrSearchChange = () => {
    setCurrentPage(1);
  };

  // Export functionality
  const handleExport = () => {
    const visibleColumns = columns.filter(col => col.visible);
    const headers = visibleColumns.map(col => col.label).join(",");
    const rows = filteredAndSortedData.map(row => {
      return visibleColumns.map(col => {
        const value = row[col.id];
        const stringValue = value?.toString() || "";
        // Escape commas and quotes
        return stringValue.includes(",") || stringValue.includes('"') 
          ? `"${stringValue.replace(/"/g, '""')}"` 
          : stringValue;
      }).join(",");
    }).join("\n");
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportFileName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import functionality
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onImport) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter(line => line.trim());
      if (lines.length < 2) return;

      const headers = lines[0].split(",").map(h => h.trim());
      const importedData = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
        const row: any = {};
        headers.forEach((header, index) => {
          const column = columns.find(col => col.label === header);
          if (column) {
            row[column.id] = values[index];
          }
        });
        return row;
      });

      onImport(importedData);
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleFilterOrSearchChange();
            }}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Add Filter Dropdown */}
          {availableFilterColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Select Field to Filter</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableFilterColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={false}
                    onCheckedChange={() => {
                      setFieldFilters({ ...fieldFilters, [column.id]: "" });
                      handleFilterOrSearchChange();
                    }}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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

          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>

          {onImport && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4" />
            <span>Active Filters ({activeFilters.length})</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {activeFilters.map(([columnId, filterValue]) => {
              const column = getColumnById(columnId);
              if (!column) return null;

              return (
                <div key={columnId} className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50">
                  <span className="text-xs font-medium text-muted-foreground">
                    {column.label}:
                  </span>
                  {column.filterType === "select" && column.filterOptions ? (
                    <Select
                      value={filterValue || ""}
                      onValueChange={(value) => handleFilterChange(columnId, value)}
                    >
                      <SelectTrigger className="h-8 w-[160px]">
                        <SelectValue placeholder="Select value" />
                      </SelectTrigger>
                      <SelectContent>
                        {column.filterOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder="Enter value..."
                      value={filterValue || ""}
                      onChange={(e) => {
                        handleFilterChange(columnId, e.target.value);
                        handleFilterOrSearchChange();
                      }}
                      className="h-8 w-[160px]"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      clearFilter(columnId);
                      handleFilterOrSearchChange();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
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
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + (actions.length > 0 ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div>
            Showing {totalRecords === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, totalRecords)} of {totalRecords} records
          </div>
          <div className="flex items-center gap-2">
            <span>Records per page:</span>
            <Select
              value={recordsPerPage.toString()}
              onValueChange={(value) => {
                setRecordsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
