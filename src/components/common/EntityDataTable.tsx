import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable, { DataTableAction } from "@/components/ui/data-table";
import { useMetaColumns } from "@/hooks/use-meta-columns";
import { USE_MOCK, getMockEntityList } from "@/lib/mock-data";
import { api } from "@/lib/api";

interface EntityDataTableProps {
  entityName: string;
  label?: string;
  onView?: (row: any) => void;
  extraActions?: React.ReactNode;
  parentContext?: { parentEntity: string; parentId: number | string };
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
  const navigate = useNavigate();
  const displayLabel = label || entityName.charAt(0).toUpperCase() + entityName.slice(1);
  const [data, setData] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const { columns, searchFields, loading: metaLoading } = useMetaColumns(entityName, {
    hiddenFields: ["documents", "metadata"],
    parentEntity: parentContext?.parentEntity,
  });

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

  const actions: DataTableAction[] = [
    ...(onView
      ? [{ icon: "view" as const, label: "View", onClick: onView }]
      : []),
    {
      icon: "edit" as const,
      label: "Edit",
      onClick: (row: any) => {
        navigate(`/${entityName}s/${row.id}/edit`);
      },
    },
  ];

  const customActions = (
    <>
      {!hideAdd && (
        <Button
          size="sm"
          className="h-8 text-xs"
          onClick={() => navigate(`/${entityName}s/new`)}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add {displayLabel}
        </Button>
      )}
      {extraActions}
    </>
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      actions={actions}
      searchableFields={searchFields}
      customActions={customActions}
    />
  );
}
