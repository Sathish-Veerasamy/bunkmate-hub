import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import MetaFormField, { FieldMeta } from "./MetaFormField";
import { Loader2 } from "lucide-react";

interface EntityMeta {
  entity: string;
  table_name: string;
  primary_key: string;
  fields: FieldMeta[];
}

const HARDCODED_DEALER_META: EntityMeta = {
  entity: "dealer",
  table_name: "dealers",
  primary_key: "id",
  fields: [
    { name: "name", type: "string", nullable: false, partial_field: true, display_type: "Single Line", constraints: { max_len: 200, min_len: 2 } },
    { name: "description", type: "multi_line", nullable: true, partial_field: true, display_type: "Multi Line" },
    { name: "phone", type: "phone", nullable: true, partial_field: true, display_type: "Phone" },
    { name: "email", type: "email", nullable: true, partial_field: true, display_type: "Email", constraints: { unique: true } },
    { name: "website", type: "string", nullable: true, partial_field: true, display_type: "Single Line" },
    { name: "rating", type: "decimal", nullable: true, partial_field: true, display_type: "Decimal", constraints: { precision: 5, scale: 2 } },
    { name: "total_orders", type: "number", nullable: true, partial_field: true, display_type: "Number" },
    { name: "is_active", type: "boolean", nullable: false, partial_field: true, display_type: "Checkbox", default: true },
    { name: "registered_date", type: "date", nullable: true, partial_field: true, display_type: "Date Picker" },
    { name: "last_visit", type: "date_time", nullable: true, partial_field: true, display_type: "Date Time Picker" },
    { name: "category", type: "enum", nullable: true, partial_field: true, display_type: "Dropdown", constraints: { values: ["LOCAL", "REGIONAL", "NATIONAL"] } },
    { name: "documents", type: "file", nullable: true, partial_field: false, display_type: "File Upload", constraints: { allowed_types: ["pdf", "jpg", "png"], max_size_mb: 10 } },
    { name: "metadata", type: "json", nullable: true, partial_field: false, display_type: "JSON Editor" },
    { name: "status", type: "ref_entity", collection: false, nullable: false, partial_field: true, display_type: "Dropdown", display_key: "name", relational_mapping: { relationship_type: "MANY_TO_ONE", ref_entity: "status", join_column: "status_id", referenced_column: "id", on_delete: "restrict", fetch: "lazy" } },
    { name: "tasks", type: "ref_entity", collection: true, nullable: true, partial_field: false, display_type: "Child Table", display_key: "title", relational_mapping: { relationship_type: "ONE_TO_MANY", ref_entity: "task", mapped_by: "context_id", context_filter: { context_type: "dealer" }, fetch: "lazy" } },
  ],
};

const HARDCODED_STATUSES = [
  { id: 1, name: "Active", code: "ACTIVE", color: "#22c55e" },
  { id: 2, name: "Inactive", code: "INACTIVE", color: "#ef4444" },
  { id: 3, name: "Pending", code: "PENDING", color: "#f59e0b" },
];

interface DynamicDealerFormProps {
  dealer?: any;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DynamicDealerForm({
  dealer,
  onClose,
  onSuccess,
}: DynamicDealerFormProps) {
  const { toast } = useToast();
  const [meta, setMeta] = useState<EntityMeta | null>(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [refOptionsMap, setRefOptionsMap] = useState<
    Record<string, { id: string | number; [key: string]: any }[]>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: dealer ?? {} });

  // ── 1. Fetch _metainfo (fallback to hardcoded) ──────────────────
  useEffect(() => {
    const fetchMeta = async () => {
      setMetaLoading(true);
      const res = await api.get<EntityMeta>("/dealers/_metainfo");
      if (res.success && res.data) {
        setMeta(res.data);
      } else {
        setMeta(HARDCODED_DEALER_META);
      }
      if (dealer) reset(dealer);
      setMetaLoading(false);
    };
    fetchMeta();
  }, []);

  // ── 2. Fetch ref_entity options lazily ──────────────────────────
  // ── 2. Fetch ref_entity options (fallback to hardcoded) ──────────
  useEffect(() => {
    if (!meta) return;

    const refFields = meta.fields.filter(
      (f) => f.type === "ref_entity" && !f.collection
    );

    refFields.forEach(async (f) => {
      const refEntity = f.relational_mapping?.ref_entity;
      if (!refEntity) return;

      const res = await api.get<any>(`/${refEntity}s`);
      if (res.success && res.data) {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.data ?? res.data.content ?? [];
        setRefOptionsMap((prev) => ({ ...prev, [f.name]: list }));
      } else if (refEntity === "status") {
        setRefOptionsMap((prev) => ({ ...prev, [f.name]: HARDCODED_STATUSES }));
      }
    });
  }, [meta]);

  // ── 3. Submit ───────────────────────────────────────────────────
  const onSubmit = async (values: any) => {
    if (!meta) return;
    setSubmitting(true);

    // Build payload: ref_entity fields are already { id, name } objects
    // File fields are arrays of File objects — skip for now (handle separately)
    const payload: Record<string, any> = {};

    meta.fields.forEach((f) => {
      const val = values[f.name];
      if (val === undefined || val === null || val === "") return;

      if (f.type === "file") return; // files handled separately

      if (f.type === "ref_entity" && !f.collection) {
        // Send as { id, <display_key>: ... }
        payload[f.name] = val;
      } else {
        payload[f.name] = val;
      }
    });

    const res = dealer
      ? await api.put(`/dealers/${dealer.id}`, payload)
      : await api.post("/dealers", payload);

    setSubmitting(false);

    if (res.success) {
      toast({
        title: dealer ? "Dealer updated" : "Dealer created",
        description: dealer
          ? "Changes saved successfully."
          : "New dealer has been added.",
      });
      onSuccess?.();
      onClose();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error ?? "Something went wrong.",
      });
    }
  };

  // ── Loading / Error states ──────────────────────────────────────
  if (metaLoading) {
    return (
      <div className="space-y-4 p-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (metaError || !meta) {
    return (
      <div className="p-6 text-center text-destructive space-y-2">
        <p className="font-medium">Failed to load form</p>
        <p className="text-sm text-muted-foreground">{metaError}</p>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  // ── Separate partial (primary form) from non-partial fields ─────
  const primaryFields = meta.fields.filter(
    (f) => f.partial_field && !(f.type === "ref_entity" && f.collection)
  );
  const secondaryFields = meta.fields.filter(
    (f) => !f.partial_field && !(f.type === "ref_entity" && f.collection)
  );

  const renderFields = (fields: FieldMeta[]) =>
    fields.map((f) => (
      <MetaFormField
        key={f.name}
        field={f}
        control={control}
        refOptions={refOptionsMap[f.name]}
        error={(errors[f.name] as any)?.message}
      />
    ));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
      {/* Primary fields grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pb-6">
        {renderFields(primaryFields)}
      </div>

      {/* Secondary / non-partial fields */}
      {secondaryFields.length > 0 && (
        <div className="border-t pt-5 space-y-5">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Additional Details
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {renderFields(secondaryFields)}
          </div>
        </div>
      )}

      {/* Sticky footer */}
      <div className="sticky bottom-0 -mx-6 -mb-6 border-t bg-card px-6 py-4 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {dealer ? "Save Changes" : "Create Dealer"}
        </Button>
      </div>
    </form>
  );
}
