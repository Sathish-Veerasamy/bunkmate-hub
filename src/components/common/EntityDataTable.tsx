import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable, { DataTableAction } from "@/components/ui/data-table";
import DynamicEntityForm from "@/components/common/DynamicEntityForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMetaColumns } from "@/hooks/use-meta-columns";
import { USE_MOCK, getMockEntityList } from "@/lib/mock-data";
import { api } from "@/lib/api";

interface EntityDataTableProps {
  entityName: string;
  /** Label for buttons, e.g. "Dealer", "Task" */
  label?: string;
  /** Row actions beyond default view/edit */
  onView?: (row: any) => void;
  /** Extra toolbar buttons */
  extraActions?: React.ReactNode;
  /** Parent context for sub-module usage */
  parentContext?: { parentEntity: string; parentId: number | string };
  /** Hide the built-in Add button */
  hideAdd?: boolean;
}

export default function EntityDataTable({
  entityName,
  label,
  onView,
  extraActions,
  parentContext,
  hideAdd = false,
}: EntityDataTableProps) {
  const displayLabel = label || entityName.charAt(0).toUpperCase() + entityName.slice(1);
  const [data, setData] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const { columns, searchFields, loading: metaLoading } = useMetaColumns(entityName, {
    hiddenFields: ["documents", "metadata"],
    parentEntity: parentContext?.parentEntity,
  });

  // Fetch entity data
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      if (USE_MOCK) {
        setData(getMockEntityList(entityName));
      } else {
        const endpoint = parentContext
          ? `/${parentContext.parentEntity}s/${parentContext.parentId}/${entityName}s`
          : `/${entityName}s`;
        const res = await api.get<any>(endpoint);
        if (res.success && res.data) {
          setData(
            Array.isArray(res.data)
              ? res.data
              : res.data.data ?? res.data.content ?? []
          );
        }
      }
      setDataLoading(false);
    };
    fetchData();
  }, [entityName, parentContext?.parentEntity, parentContext?.parentId]);

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingRecord(null);
  };

  const actions: DataTableAction[] = [
    ...(onView
      ? [{ icon: "view" as const, label: "View", onClick: onView }]
      : []),
    {
      icon: "edit" as const,
      label: "Edit",
      onClick: (row: any) => {
        setEditingRecord(row);
        setFormOpen(true);
      },
    },
  ];

  const customActions = (
    <>
      {!hideAdd && (
        <Button
          size="sm"
          className="h-8 text-xs"
          onClick={() => {
            setEditingRecord(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add {displayLabel}
        </Button>
      )}
      {extraActions}
    </>
  );

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        actions={actions}
        searchableFields={searchFields}
        customActions={customActions}
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRecord ? `Edit ${displayLabel}` : `Add ${displayLabel}`}
            </DialogTitle>
            <DialogDescription>
              {editingRecord
                ? `Update ${displayLabel.toLowerCase()} details`
                : `Create a new ${displayLabel.toLowerCase()}`}
            </DialogDescription>
          </DialogHeader>
          {formOpen && (
            <DynamicEntityForm
              entityName={entityName}
              record={editingRecord}
              onClose={handleFormClose}
              parentContext={
                parentContext
                  ? {
                      parentEntity: parentContext.parentEntity,
                      parentId: parentContext.parentId,
                    }
                  : undefined
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
