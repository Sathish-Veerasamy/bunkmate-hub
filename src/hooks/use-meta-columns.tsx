import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTableColumn } from "@/components/ui/data-table";
import { FieldMeta } from "@/components/dealers/MetaFormField";
import {
  USE_MOCK,
  getEntityMeta,
  getRefEntityOptions,
  type EntityMeta,
} from "@/lib/mock-data";
import { api } from "@/lib/api";

function toLabel(name: string) {
  return name
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Hook that derives DataTable columns, searchable fields,
 * and filter options from entity metainfo.
 *
 * - `enum` fields → dropdown filter with constraints.values
 * - `ref_entity` (standalone=false, collection=false) → dropdown filter,
 *     values fetched from `/{parentEntity}s/{fieldName}` or mock
 * - `boolean` → dropdown filter (Yes / No) + badge render
 * - Only `partial_field` & non-collection fields become columns
 * - All string-like visible columns become searchable
 */
export function useMetaColumns(
  entityName: string,
  options?: {
    /** Extra columns to hide by default */
    hiddenFields?: string[];
    /** Parent entity name for ref_entity filter URL (e.g. "dealer") */
    parentEntity?: string;
  }
) {
  const [refFilterOptions, setRefFilterOptions] = useState<
    Record<string, { label: string; value: string }[]>
  >({});
  const [metaLoading, setMetaLoading] = useState(true);
  const [meta, setMeta] = useState<EntityMeta | null>(null);

  const hiddenSet = new Set(options?.hiddenFields ?? []);

  // ── 1. Load metainfo ────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setMetaLoading(true);
      let entityMeta: EntityMeta | null = null;

      if (USE_MOCK) {
        entityMeta = getEntityMeta(entityName);
      } else {
        const res = await api.get<EntityMeta>(`/${entityName}s/_metainfo`);
        if (res.success && res.data) {
          entityMeta = res.data;
        } else {
          entityMeta = getEntityMeta(entityName); // fallback
        }
      }

      setMeta(entityMeta);
      setMetaLoading(false);
    };
    load();
  }, [entityName]);

  // ── 2. Fetch ref_entity filter values (standalone=false) ────────
  useEffect(() => {
    if (!meta) return;

    const refFields = meta.fields.filter(
      (f) =>
        f.type === "ref_entity" &&
        !f.collection &&
        f.standalone !== true
    );

    refFields.forEach(async (f) => {
      const refEntity = f.relational_mapping?.ref_entity;
      if (!refEntity) return;

      const displayKey = f.display_key || "name";
      let items: any[] = [];

      if (USE_MOCK) {
        items = getRefEntityOptions(refEntity);
      } else {
        // Fetch from /{parentEntity}s/{fieldName} or /{refEntity}s
        const parentPlural = options?.parentEntity
          ? `${options.parentEntity}s`
          : `${entityName}s`;
        const endpoint = `/${parentPlural}/${f.name}`;
        const res = await api.get<any>(endpoint);
        if (res.success && res.data) {
          items = Array.isArray(res.data)
            ? res.data
            : res.data.data ?? res.data.content ?? [];
        } else {
          items = getRefEntityOptions(refEntity); // fallback
        }
      }

      if (items.length > 0) {
        setRefFilterOptions((prev) => ({
          ...prev,
          [f.name]: items.map((item) => ({
            label: item[displayKey] || item.name || String(item.id),
            value: item[displayKey] || item.name || String(item.id),
          })),
        }));
      }
    });
  }, [meta, entityName]);

  // ── 3. Build columns from meta ──────────────────────────────────
  const { columns, searchFields } = useMemo(() => {
    if (!meta) return { columns: [] as DataTableColumn[], searchFields: [] as string[] };

    const visibleFields = meta.fields.filter(
      (f) =>
        !(f.type === "ref_entity" && f.collection) && // skip child tables
        f.type !== "file" &&
        f.type !== "json" &&
        f.type !== "multi_line"
    );

    const cols: DataTableColumn[] = [];
    const search: string[] = [];

    visibleFields.forEach((f) => {
      const col: DataTableColumn = {
        id: f.name,
        label: toLabel(f.name),
        visible: f.partial_field && !hiddenSet.has(f.name),
      };

      // ── enum → dropdown filter
      if (f.type === "enum" && f.constraints?.values) {
        col.filterable = true;
        col.filterType = "select";
        col.filterOptions = (f.constraints.values as string[]).map((v) => ({
          label: v,
          value: v,
        }));

        // Colored badges for common patterns
        if (f.name === "status" || f.name === "priority") {
          col.render = (value: string) => {
            const statusColors: Record<string, string> = {
              Active: "bg-green-100 text-green-800",
              Completed: "bg-green-100 text-green-800",
              Pending: "bg-amber-100 text-amber-800",
              "In Progress": "bg-blue-100 text-blue-800",
              Cancelled: "bg-muted text-muted-foreground",
              Expired: "bg-muted text-muted-foreground",
              High: "bg-red-100 text-red-800",
              Medium: "bg-amber-100 text-amber-800",
              Low: "bg-green-100 text-green-800",
            };
            return (
              <Badge
                variant="secondary"
                className={statusColors[value] || ""}
              >
                {value}
              </Badge>
            );
          };
        }
      }

      // ── ref_entity (standalone=false) → dropdown filter
      if (f.type === "ref_entity" && !f.collection && f.standalone !== true) {
        col.filterable = true;
        col.filterType = "select";
        col.filterOptions = refFilterOptions[f.name] || [];

        // Render the display_key value (object → string)
        const displayKey = f.display_key || "name";
        col.render = (value: any) => {
          if (value && typeof value === "object") {
            return <span>{value[displayKey] || "—"}</span>;
          }
          return <span>{value || "—"}</span>;
        };
      }

      // ── boolean → dropdown filter + badge
      if (f.type === "boolean") {
        col.filterable = true;
        col.filterType = "select";
        col.filterOptions = [
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ];
        col.sortable = false;
        col.render = (value: boolean) => (
          <Badge
            variant={value ? "default" : "secondary"}
            className={value ? "bg-green-100 text-green-800" : ""}
          >
            {value ? "Yes" : "No"}
          </Badge>
        );
      }

      // ── searchable: string-like fields
      if (
        ["string", "email", "phone", "enum", "ref_entity"].includes(f.type) &&
        !f.collection
      ) {
        search.push(f.name);
      }

      cols.push(col);
    });

    return { columns: cols, searchFields: search };
  }, [meta, refFilterOptions, hiddenSet.size]);

  return { columns, searchFields, meta, loading: metaLoading };
}
