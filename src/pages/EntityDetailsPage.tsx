import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import DataTable, { DataTableAction } from "@/components/ui/data-table";
import { api } from "@/lib/api";
import {
  USE_MOCK,
  getEntityMeta,
  getMockEntityById,
  getMockSubModuleData,
  type EntityMeta,
} from "@/lib/mock-data";
import { useMetaColumns } from "@/hooks/use-meta-columns";
import { FieldMeta } from "@/components/dealers/MetaFormField";

// ── Helper ──────────────────────────────────
function toLabel(name: string) {
  return name
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value: any, field: FieldMeta): string {
  if (value === null || value === undefined || value === "") return "—";
  if (field.type === "boolean") return value ? "Yes" : "No";
  if (field.type === "ref_entity" && typeof value === "object") {
    return value[field.display_key || "name"] || "—";
  }
  return String(value);
}

// ── Sub-module tab (reusable) ───────────────
function SubModuleTab({
  tabKey,
  refEntity,
  data,
  entityName,
  entityId,
}: {
  tabKey: string;
  refEntity: string;
  data: any[];
  entityName: string;
  entityId: string;
}) {
  const navigate = useNavigate();
  const { columns, searchFields } = useMetaColumns(refEntity);

  const label = toLabel(tabKey).replace(/s$/, "");

  const actions: DataTableAction[] = [
    {
      icon: "view",
      label: "View",
      onClick: (row) => navigate(`/${refEntity}s/${row.id}/details`),
    },
    {
      icon: "edit",
      label: "Edit",
      onClick: (row) => navigate(`/${refEntity}s/${row.id}/edit`),
    },
  ];

  const customActions = (
    <Button
      size="sm"
      className="h-8 text-xs"
      onClick={() => navigate(`/${refEntity}s/new`)}
    >
      Add {label}
    </Button>
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

// ── Props ───────────────────────────────────
interface EntityDetailsPageProps {
  entityName?: string;
  /** Optional custom details renderer. Receives the record and meta. */
  renderDetails?: (record: any, meta: EntityMeta) => React.ReactNode;
}

function singularize(s: string) {
  return s.endsWith("s") ? s.slice(0, -1) : s;
}

export default function EntityDetailsPage({
  entityName: entityNameProp,
  renderDetails,
}: EntityDetailsPageProps) {
  const { id, tab, entity: entityParam } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeTab = tab || "details";

  // Resolve entity name from prop, URL param, or pathname
  const entityName = entityNameProp || singularize(entityParam || pathname.split("/").filter(Boolean)[0] || "");
  const plural = `${entityName}s`;

  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<EntityMeta | null>(null);
  const [subModuleData, setSubModuleData] = useState<Record<string, any[]>>({});

  // ── Load meta ───────────────────────────────
  useEffect(() => {
    const m = getEntityMeta(entityName);
    setMeta(m);
  }, [entityName]);

  // ── Derive sub-module tabs from meta ────────
  const subModuleTabs = (meta?.fields ?? [])
    .filter((f) => f.type === "ref_entity" && f.collection && f.standalone)
    .map((f) => ({
      key: f.name,
      label: toLabel(f.name),
      displayKey: f.display_key,
      refEntity: f.relational_mapping?.ref_entity,
      mappedBy: f.relational_mapping?.mapped_by,
    }));

  // ── Fetch record ────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      if (USE_MOCK) {
        setRecord(getMockEntityById(entityName, id!));
      } else {
        const res = await api.get<any>(`/${plural}/${id}`);
        setRecord(res.success ? res.data : null);
      }
      setLoading(false);
    };
    fetch();
  }, [entityName, id]);

  // ── Fetch sub-module data ───────────────────
  useEffect(() => {
    if (!id) return;
    const fetchSubs = async () => {
      const map: Record<string, any[]> = {};
      for (const t of subModuleTabs) {
        if (USE_MOCK) {
          map[t.key] = getMockSubModuleData(t.key, parseInt(id));
        } else {
          const endpoint = t.mappedBy
            ? `/${t.refEntity}s?${t.mappedBy}=${id}`
            : `/${t.refEntity}s`;
          const res = await api.get<any>(endpoint);
          if (res.success && res.data) {
            map[t.key] = Array.isArray(res.data)
              ? res.data
              : res.data.data ?? res.data.content ?? [];
          } else {
            map[t.key] = [];
          }
        }
      }
      setSubModuleData(map);
    };
    fetchSubs();
  }, [entityName, id, meta]);

  const handleTabChange = (value: string) => {
    navigate(`/${plural}/${id}/${value}`, { replace: true });
  };

  // ── Loading / Not found ─────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">{toLabel(entityName)} not found</p>
            <Button onClick={() => navigate(`/${plural}`)} className="mt-4">
              Back to {toLabel(entityName)}s
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Build generic detail fields ─────────────
  const detailFields = (meta?.fields ?? []).filter(
    (f) =>
      !(f.type === "ref_entity" && f.collection) &&
      f.type !== "file" &&
      f.type !== "json"
  );

  const primaryDetails = detailFields.filter((f) => f.partial_field);
  const secondaryDetails = detailFields.filter((f) => !f.partial_field);

  // Determine display name from first string field or "name" or "title"
  const displayName =
    record.name || record.title || record.dealerName || `${toLabel(entityName)} #${id}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/${plural}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{displayName}</h1>
          {record.description && (
            <p className="text-sm text-muted-foreground">{record.description}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/${plural}/${id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-1.5" />
          Edit
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {subModuleTabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
              <Badge
                variant="secondary"
                className="ml-1.5 text-[10px] px-1.5 py-0 min-w-[18px]"
              >
                {(subModuleData[t.key] ?? []).length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          {renderDetails ? (
            renderDetails(record, meta!)
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Primary fields */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">
                    {toLabel(entityName)} Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  {primaryDetails.map((f) => (
                    <div key={f.name} className="flex flex-col gap-0.5">
                      <span className="text-xs text-muted-foreground">
                        {toLabel(f.name)}
                      </span>
                      <span className="text-sm font-medium">
                        {f.type === "boolean" ? (
                          <Badge
                            variant={record[f.name] ? "default" : "secondary"}
                            className={
                              record[f.name] ? "bg-green-100 text-green-800" : ""
                            }
                          >
                            {record[f.name] ? "Yes" : "No"}
                          </Badge>
                        ) : (
                          formatValue(record[f.name], f)
                        )}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Secondary fields */}
              {secondaryDetails.length > 0 && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Additional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-3">
                    {secondaryDetails.map((f) => (
                      <div key={f.name} className="flex flex-col gap-0.5">
                        <span className="text-xs text-muted-foreground">
                          {toLabel(f.name)}
                        </span>
                        <span className="text-sm font-medium">
                          {formatValue(record[f.name], f)}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Dynamic sub-module tabs */}
        {subModuleTabs.map((t) => {
          if (!t.refEntity) return null;
          return (
            <TabsContent key={t.key} value={t.key} className="mt-0">
              <SubModuleTab
                tabKey={t.key}
                refEntity={t.refEntity}
                data={subModuleData[t.key] ?? []}
                entityName={entityName}
                entityId={id!}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
