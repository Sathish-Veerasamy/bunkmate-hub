import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import MetaFormField, { FieldMeta } from "@/components/dealers/MetaFormField";
import { Loader2 } from "lucide-react";
import { USE_MOCK, getEntityMeta, getRefEntityOptions, type EntityMeta } from "@/lib/mock-data";

interface DynamicEntityFormProps {
  entityName: string;
  record?: any;
  onClose: () => void;
  onSuccess?: (responseData?: any) => void;
  parentContext?: {
    parentEntity: string;
    parentId: number | string;
    mappedBy?: string;
  };
}

function toTitle(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function DynamicEntityForm({
  entityName,
  record,
  onClose,
  onSuccess,
  parentContext,
}: DynamicEntityFormProps) {
  const { toast } = useToast();
  const [meta, setMeta] = useState<EntityMeta | null>(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [refOptionsMap, setRefOptionsMap] = useState<
    Record<string, { id: string | number; [key: string]: any }[]>
  >({});
  const [submitting, setSubmitting] = useState(false);

  // Store initial values to diff for edit mode
  const initialValues = useRef<Record<string, any>>({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: record ?? {} });

  const entityLabel = toTitle(entityName);
  const entityPlural = `${entityName}s`;

  // ── 1. Fetch _metainfo ──────────────────────────────────────────
  useEffect(() => {
    const fetchMeta = async () => {
      setMetaLoading(true);
      if (USE_MOCK) {
        const mockMeta = getEntityMeta(entityName);
        if (mockMeta) {
          setMeta(mockMeta);
        } else {
          setMetaError(`No metadata found for entity: ${entityName}`);
        }
      } else {
        const res = await api.get<EntityMeta>(`/${entityPlural}/_metainfo`);
        if (res.success && res.data) {
          setMeta(res.data);
        } else {
          const fallback = getEntityMeta(entityName);
          if (fallback) setMeta(fallback);
          else setMetaError("Failed to load form metadata");
        }
      }
      if (record) {
        reset(record);
        initialValues.current = { ...record };
      }
      setMetaLoading(false);
    };
    fetchMeta();
  }, [entityName]);

  // ── 2. Fetch ref_entity options ─────────────────────────────────
  useEffect(() => {
    if (!meta) return;

    const refFields = meta.fields.filter(
      (f) => f.type === "ref_entity" && !f.collection
    );

    refFields.forEach(async (f) => {
      const refEntity = f.relational_mapping?.ref_entity;
      if (!refEntity) return;

      if (USE_MOCK) {
        const options = getRefEntityOptions(refEntity);
        if (options.length > 0) {
          setRefOptionsMap((prev) => ({ ...prev, [f.name]: options }));
        }
      } else {
        const res = await api.get<any>(`/${refEntity}s`);
        if (res.success && res.data) {
          const list = Array.isArray(res.data)
            ? res.data
            : res.data.data ?? res.data.content ?? [];
          setRefOptionsMap((prev) => ({ ...prev, [f.name]: list }));
        } else {
          const fallback = getRefEntityOptions(refEntity);
          if (fallback.length > 0) {
            setRefOptionsMap((prev) => ({ ...prev, [f.name]: fallback }));
          }
        }
      }
    });
  }, [meta]);

  // ── 3. Submit ───────────────────────────────────────────────────
  const onSubmit = async (values: any) => {
    if (!meta) return;
    setSubmitting(true);

    const endpoint = `/${entityPlural}`;
    const isEdit = !!record;

    if (isEdit) {
      // Only send modified fields
      const modifiedFields: Record<string, any> = {};
      meta.fields.forEach((f) => {
        if (f.type === "file") return;
        const newVal = values[f.name];
        const oldVal = initialValues.current[f.name];
        if (newVal !== oldVal) {
          modifiedFields[f.name] = newVal ?? null;
        }
      });

      if (Object.keys(modifiedFields).length === 0) {
        toast({ title: "No changes", description: "Nothing was modified." });
        setSubmitting(false);
        return;
      }

      const res = await api.put(`${endpoint}/${record.id}`, { input_data: modifiedFields });
      setSubmitting(false);

      if (res.success) {
        toast({ title: `${entityLabel} updated`, description: "Changes saved successfully." });
        onSuccess?.(res.data);
        onClose();
      } else {
        toast({ variant: "destructive", title: "Error", description: res.error ?? "Something went wrong." });
      }
    } else {
      // Create: wrap all fields in input_data
      const payload: Record<string, any> = {};
      meta.fields.forEach((f) => {
        const val = values[f.name];
        if (val === undefined || val === null || val === "") return;
        if (f.type === "file") return;
        payload[f.name] = val;
      });

      if (parentContext?.mappedBy) {
        payload[parentContext.mappedBy] = parentContext.parentId;
      }

      const res = await api.post(endpoint, { input_data: payload });
      setSubmitting(false);

      if (res.success) {
        toast({ title: `${entityLabel} created`, description: `New ${entityName} has been added.` });
        onSuccess?.(res.data);
      } else {
        toast({ variant: "destructive", title: "Error", description: res.error ?? "Something went wrong." });
      }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pb-6">
        {renderFields(primaryFields)}
      </div>

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

      <div className="sticky bottom-0 -mx-6 -mb-6 border-t bg-card px-6 py-4 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {record ? `Save Changes` : `Create ${entityLabel}`}
        </Button>
      </div>
    </form>
  );
}
