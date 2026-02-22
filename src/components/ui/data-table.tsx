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
import { cn } from "@/lib/utils";

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
    setCurrentPage(1);
  };

  const clearFilter = (columnId: string) => {
    const newFilters = { ...fieldFilters };
    delete newFilters[columnId];
    setFieldFilters(newFilters);
    setCurrentPage(1);
  };

  const getColumnById = (columnId: string) => columns.find(col => col.id === columnId);

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((row) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = searchableFields.some((field) => {
          const value = row[field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
        if (!matchesSearch) return false;
      }
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
      case "view": return Eye;
      case "edit": return Pencil;
      case "delete": return Trash2;
      default: return Eye;
    }
  };

  const filterableColumns = columns.filter((col) => col.filterable);
  const activeFilters = Object.entries(fieldFilters);
  const availableFilterColumns = filterableColumns.filter(col => !fieldFilters.hasOwnProperty(col.id));

  // Pagination
  const totalRecords = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

  // Row selection
  const toggleRowSelection = (rowId: any) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) newSelected.delete(rowId);
    else newSelected.add(rowId);
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === paginatedData.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(paginatedData.map(row => row.id)));
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedRows.size > 0) {
      onBulkDelete(Array.from(selectedRows));
      setSelectedRows(new Set());
    }
  };

  const handleBulkExport = () => {
    const vis = columns.filter(col => col.visible);
    const headers = vis.map(col => col.label).join(",");
    const dataToExport = selectedRows.size > 0
      ? filteredAndSortedData.filter(row => selectedRows.has(row.id))
      : filteredAndSortedData;
    const rows = dataToExport.map(row =>
      vis.map(col => {
        const value = row[col.id];
        const s = value?.toString() || "";
        return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(",")
    ).join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportFileName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
          if (column) row[column.id] = values[index];
        });
        return row;
      });
      onImport(importedData);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 pb-3">
        <div className="flex items-center gap-1.5 flex-1">
          {customActions}

          {selectedRows.size > 0 && (
            <div className="flex items-center gap-1.5 ml-2">
              <Badge variant="secondary" className="text-xs font-normal px-2 py-0.5">
                {selectedRows.size} selected
              </Badge>
              {onBulkDelete && (
                <Button variant="destructive" size="sm" className="h-7 text-xs px-2" onClick={handleBulkDelete}>
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              )}
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={handleBulkExport}>
                <Download className="h-3 w-3 mr-1" /> Export
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-1">
              {activeFilters.map(([columnId, filterValue]) => {
                const column = getColumnById(columnId);
                if (!column) return null;
                const displayValue = column.filterType === "select" && column.filterOptions
                  ? column.filterOptions.find(o => o.value === filterValue)?.label || filterValue
                  : filterValue;
                return (
                  <Badge
                    key={columnId}
                    variant="secondary"
                    className="text-xs font-normal gap-1 pl-2 pr-1 py-0.5 cursor-default"
                  >
                    <span className="text-muted-foreground">{column.label}:</span>
                    <span className="font-medium">{displayValue}</span>
                    <button
                      onClick={() => clearFilter(columnId)}
                      className="ml-0.5 hover:bg-foreground/10 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Add Filter */}
          {availableFilterColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
                  <Filter className="h-3 w-3 mr-1" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">Add Filter</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableFilterColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={false}
                    onCheckedChange={() => {
                      if (column.filterType === "select" && column.filterOptions?.[0]) {
                        setFieldFilters({ ...fieldFilters, [column.id]: column.filterOptions[0].value });
                      } else {
                        setFieldFilters({ ...fieldFilters, [column.id]: "" });
                      }
                      setCurrentPage(1);
                    }}
                    className="text-xs"
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Search */}
          <div className="relative w-44">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-7 h-7 text-xs border-0 bg-muted/50 focus-visible:bg-background focus-visible:ring-1"
            />
          </div>

          {/* Columns toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                <Settings2 className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-xs">Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.visible}
                  onCheckedChange={() => toggleColumn(column.id)}
                  className="text-xs"
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedRows.size === 0 && (
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" onClick={handleBulkExport}>
              <Download className="h-3.5 w-3.5" />
            </Button>
          )}

          {onImport && (
            <>
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
              <TableHead className="w-10 h-8 px-3">
                <Checkbox
                  checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                  onCheckedChange={toggleAllRows}
                  className="h-3.5 w-3.5"
                />
              </TableHead>
              {actions.length > 0 && (
                <TableHead className="w-24 h-8 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </TableHead>
              )}
              {visibleColumns.map((column) => (
                <TableHead key={column.id} className="h-8 px-3">
                  {column.sortable !== false ? (
                    <button
                      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                      <ArrowUpDown className={cn(
                        "h-3 w-3 transition-colors",
                        sortColumn === column.id ? "text-primary" : "text-muted-foreground/40"
                      )} />
                    </button>
                  ) : (
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {column.label}
                    </span>
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
                  className="h-20 text-center text-sm text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  className={cn(
                    "border-b border-border/40 transition-colors",
                    selectedRows.has(row.id) && "bg-primary/[0.03]",
                    "hover:bg-muted/40"
                  )}
                >
                  <TableCell className="px-3 py-2">
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onCheckedChange={() => toggleRowSelection(row.id)}
                      className="h-3.5 w-3.5"
                    />
                  </TableCell>
                  {actions.length > 0 && (
                    <TableCell className="px-2 py-2">
                      <div className="flex gap-0.5">
                        {actions.map((action, actionIndex) => {
                          const Icon = getActionIcon(action.icon);
                          return (
                            <Button
                              key={actionIndex}
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-foreground"
                              onClick={() => action.onClick(row)}
                              title={action.label}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </Button>
                          );
                        })}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id} className="px-3 py-2 text-sm">
                      {column.render
                        ? column.render(row[column.id], row)
                        : <span className="text-foreground/90">{row[column.id]?.toString() || "—"}</span>}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{totalRecords === 0 ? 0 : startIndex + 1}–{Math.min(endIndex, totalRecords)} of {totalRecords}</span>
          <Select
            value={recordsPerPage.toString()}
            onValueChange={(value) => { setRecordsPerPage(Number(value)); setCurrentPage(1); }}
          >
            <SelectTrigger className="h-6 w-14 text-xs border-0 bg-transparent px-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10" className="text-xs">10</SelectItem>
              <SelectItem value="25" className="text-xs">25</SelectItem>
              <SelectItem value="50" className="text-xs">50</SelectItem>
              <SelectItem value="100" className="text-xs">100</SelectItem>
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) pageNumber = i + 1;
            else if (currentPage <= 3) pageNumber = i + 1;
            else if (currentPage >= totalPages - 2) pageNumber = totalPages - 4 + i;
            else pageNumber = currentPage - 2 + i;

            return (
              <Button
                key={pageNumber}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 w-6 p-0 text-xs",
                  currentPage === pageNumber
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
