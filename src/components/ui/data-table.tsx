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
import { Checkbox } from "@/components/ui/checkbox";
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
  onBulkDelete?: (selectedIds: any[]) => void;
  exportFileName?: string;
  customActions?: React.ReactNode;
}

export default function DataTable({
  data,
  columns: initialColumns,
  actions = [],
  searchableFields = [],
  onColumnToggle,
  onImport,
  onBulkDelete,
  exportFileName = "export",
  customActions,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columns, setColumns] = useState<DataTableColumn[]>(initialColumns);
  const [fieldFilters, setFieldFilters] = useState<Record<string, string>>({});
  const [selectedFilterField, setSelectedFilterField] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
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

  // Row selection
  const toggleRowSelection = (rowId: any) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedRows.size > 0) {
      onBulkDelete(Array.from(selectedRows));
      setSelectedRows(new Set());
    }
  };

  const handleBulkExport = () => {
    const visibleColumns = columns.filter(col => col.visible);
    const headers = visibleColumns.map(col => col.label).join(",");
    const dataToExport = selectedRows.size > 0 
      ? filteredAndSortedData.filter(row => selectedRows.has(row.id))
      : filteredAndSortedData;
    
    const rows = dataToExport.map(row => {
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
    <div className="space-y-3">
      {/* Search and Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          {/* Custom Actions */}
          {customActions && (
            <div className="flex items-center gap-2">
              {customActions}
            </div>
          )}
          
          <div className="flex-1" />
          
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterOrSearchChange();
              }}
              className="pl-8 h-8 text-sm"
            />
          </div>
          
          {selectedRows.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {selectedRows.size} selected
              </span>
              {onBulkDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={handleBulkExport}
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Export Selected
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Active Filters Indicator */}
          {activeFilters.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                  <Filter className="h-3.5 w-3.5" />
                  Filters ({activeFilters.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Active Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
                  {activeFilters.map(([columnId, filterValue]) => {
                    const column = getColumnById(columnId);
                    if (!column) return null;

                    return (
                      <div key={columnId} className="flex items-center gap-2 p-2 border rounded bg-muted/50">
                        <span className="text-xs font-medium text-muted-foreground min-w-[80px]">
                          {column.label}:
                        </span>
                        {column.filterType === "select" && column.filterOptions ? (
                          <Select
                            value={filterValue || ""}
                            onValueChange={(value) => handleFilterChange(columnId, value)}
                          >
                            <SelectTrigger className="h-7 flex-1 text-xs">
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
                            className="h-7 flex-1 text-xs"
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            clearFilter(columnId);
                            handleFilterOrSearchChange();
                          }}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Add Filter Dropdown */}
          {availableFilterColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Add Filter</DropdownMenuLabel>
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
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                <Settings2 className="h-3.5 w-3.5" />
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

          {selectedRows.size === 0 && (
            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={handleBulkExport}>
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          )}

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
                className="gap-1.5 h-8 text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" />
                Import
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
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
                  colSpan={visibleColumns.length + (actions.length > 0 ? 2 : 1)}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow key={row.id || index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onCheckedChange={() => toggleRowSelection(row.id)}
                    />
                  </TableCell>
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div>
            Showing {totalRecords === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, totalRecords)} of {totalRecords}
          </div>
          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <Select
              value={recordsPerPage.toString()}
              onValueChange={(value) => {
                setRecordsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-7 w-[60px] text-xs">
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

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Prev
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
                  className="h-7 w-7 p-0 text-xs"
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
            className="h-7 px-2 text-xs"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
