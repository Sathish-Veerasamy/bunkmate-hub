import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";

export interface FieldMeta {
  name: string;
  type: string;
  nullable: boolean;
  partial_field: boolean;
  display_type: string;
  constraints?: Record<string, any>;
  relational_mapping?: {
    relationship_type: string;
    ref_entity: string;
    join_column?: string;
    referenced_column?: string;
    mapped_by?: string;
    context_filter?: Record<string, string>;
    fetch: string;
  };
  display_key?: string;
  collection?: boolean;
}

interface MetaFormFieldProps {
  field: FieldMeta;
  control: Control<any>;
  refOptions?: { id: string | number; [key: string]: any }[];
  error?: string;
}

function toLabel(name: string) {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function MetaFormField({
  field,
  control,
  refOptions = [],
  error,
}: MetaFormFieldProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const label = toLabel(field.name);
  const required = !field.nullable;

  // Skip non-partial fields that shouldn't be in primary form (like child tables)
  if (field.type === "ref_entity" && field.collection) return null;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={field.name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <Controller
        name={field.name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        defaultValue={
          field.type === "boolean"
            ? (field.constraints?.default ?? false)
            : undefined
        }
        render={({ field: ctrl }) => {
          switch (field.display_type) {
            // ── Text / Single Line ──────────────────────────────
            case "Single Line":
              return (
                <Input
                  id={field.name}
                  {...ctrl}
                  value={ctrl.value ?? ""}
                  placeholder={label}
                />
              );

            // ── Multi Line ──────────────────────────────────────
            case "Multi Line":
              return (
                <Textarea
                  id={field.name}
                  {...ctrl}
                  value={ctrl.value ?? ""}
                  placeholder={label}
                  rows={3}
                />
              );

            // ── Email ───────────────────────────────────────────
            case "Email":
              return (
                <Input
                  id={field.name}
                  type="email"
                  {...ctrl}
                  value={ctrl.value ?? ""}
                  placeholder="example@email.com"
                />
              );

            // ── Phone ───────────────────────────────────────────
            case "Phone":
              return (
                <Input
                  id={field.name}
                  type="tel"
                  {...ctrl}
                  value={ctrl.value ?? ""}
                  placeholder="+91 98765 43210"
                />
              );

            // ── Number ──────────────────────────────────────────
            case "Number":
              return (
                <Input
                  id={field.name}
                  type="number"
                  {...ctrl}
                  value={ctrl.value ?? ""}
                  placeholder="0"
                />
              );

            // ── Decimal ─────────────────────────────────────────
            case "Decimal":
              return (
                <Input
                  id={field.name}
                  type="number"
                  step="0.01"
                  {...ctrl}
                  value={ctrl.value ?? ""}
                  placeholder="0.00"
                />
              );

            // ── Checkbox / Boolean ──────────────────────────────
            case "Checkbox":
              return (
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id={field.name}
                    checked={!!ctrl.value}
                    onCheckedChange={ctrl.onChange}
                  />
                  <span className="text-sm text-muted-foreground">
                    {ctrl.value ? "Yes" : "No"}
                  </span>
                </div>
              );

            // ── Date Picker ─────────────────────────────────────
            case "Date Picker":
              return (
                <Input
                  id={field.name}
                  type="date"
                  {...ctrl}
                  value={ctrl.value ?? ""}
                />
              );

            // ── Date Time Picker ────────────────────────────────
            case "Date Time Picker":
              return (
                <Input
                  id={field.name}
                  type="datetime-local"
                  {...ctrl}
                  value={ctrl.value ?? ""}
                />
              );

            // ── Dropdown (enum) ─────────────────────────────────
            case "Dropdown":
              if (field.type === "enum" && field.constraints?.values) {
                return (
                  <Select
                    value={ctrl.value ?? ""}
                    onValueChange={ctrl.onChange}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.constraints.values.map((v: string) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }

              // ref_entity dropdown
              if (field.type === "ref_entity" && !field.collection) {
                const displayKey = field.display_key ?? "name";
                return (
                  <Select
                    value={ctrl.value?.id ? String(ctrl.value.id) : ""}
                    onValueChange={(val) => {
                      const selected = refOptions.find(
                        (o) => String(o.id) === val
                      );
                      // Send as { id, name } object per API contract
                      ctrl.onChange(
                        selected
                          ? { id: selected.id, [displayKey]: selected[displayKey] }
                          : undefined
                      );
                    }}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {refOptions.map((opt) => (
                        <SelectItem key={opt.id} value={String(opt.id)}>
                          {opt[displayKey]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }

              return <Input {...ctrl} value={ctrl.value ?? ""} />;

            // ── File Upload ─────────────────────────────────────
            case "File Upload": {
              const allowedTypes = field.constraints?.allowed_types ?? [];
              const accept = allowedTypes.map((t: string) => `.${t}`).join(",");

              const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                  const newFiles = Array.from(e.target.files);
                  setFiles((prev) => {
                    const updated = [...prev, ...newFiles];
                    ctrl.onChange(updated);
                    return updated;
                  });
                }
              };

              const remove = (i: number) => {
                setFiles((prev) => {
                  const updated = prev.filter((_, idx) => idx !== i);
                  ctrl.onChange(updated);
                  return updated;
                });
              };

              return (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={accept}
                      className="hidden"
                      onChange={handleFiles}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </Button>
                    <span className="text-xs text-muted-foreground self-center">
                      {allowedTypes.join(", ").toUpperCase()} · max{" "}
                      {field.constraints?.max_size_mb ?? 10}MB
                    </span>
                  </div>
                  {files.length > 0 && (
                    <div className="space-y-1">
                      {files.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-3 py-1.5 rounded-md bg-muted text-sm"
                        >
                          <span className="truncate flex-1">{f.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-2 shrink-0"
                            onClick={() => remove(i)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // ── JSON Editor ─────────────────────────────────────
            case "JSON Editor": {
              const raw =
                typeof ctrl.value === "object"
                  ? JSON.stringify(ctrl.value, null, 2)
                  : (ctrl.value ?? "");
              return (
                <Textarea
                  id={field.name}
                  value={raw}
                  onChange={(e) => {
                    try {
                      ctrl.onChange(JSON.parse(e.target.value));
                    } catch {
                      ctrl.onChange(e.target.value);
                    }
                  }}
                  placeholder='{"key": "value"}'
                  rows={4}
                  className="font-mono text-xs"
                />
              );
            }

            // ── Color Picker ────────────────────────────────────
            case "Color Picker":
              return (
                <div className="flex items-center gap-3">
                  <input
                    id={field.name}
                    type="color"
                    value={ctrl.value ?? "#000000"}
                    onChange={(e) => ctrl.onChange(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-md border border-input p-0.5"
                  />
                  <Input
                    value={ctrl.value ?? ""}
                    onChange={(e) => ctrl.onChange(e.target.value)}
                    placeholder="#000000"
                    className="w-32"
                  />
                </div>
              );

            default:
              return (
                <Input
                  id={field.name}
                  {...ctrl}
                  value={ctrl.value ?? ""}
                  placeholder={label}
                />
              );
          }
        }}
      />

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
