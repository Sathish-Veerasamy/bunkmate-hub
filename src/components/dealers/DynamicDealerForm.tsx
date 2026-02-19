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

  // ── 1. Fetch _metainfo ──────────────────────────────────────────
  useEffect(() => {
    const fetchMeta = async () => {
      setMetaLoading(true);
      const res = await api.get<EntityMeta>("/dealers/_metainfo");
      if (res.success && res.data) {
        setMeta(res.data);
        // Pre-populate form values for edit
        if (dealer) reset(dealer);
      } else {
        setMetaError(res.error ?? "Failed to load form metadata");
      }
      setMetaLoading(false);
    };
    fetchMeta();
  }, []);

  // ── 2. Fetch ref_entity options lazily ──────────────────────────
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
        // Support both array and paginated { data: [] } shapes
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.data ?? res.data.content ?? [];
        setRefOptionsMap((prev) => ({ ...prev, [f.name]: list }));
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
