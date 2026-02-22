import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { USE_MOCK, getMockEntityList } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { useMetaColumns } from "@/hooks/use-meta-columns";

export default function Donations() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const { columns, searchFields } = useMetaColumns("donation");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (USE_MOCK) {
        setDonations(getMockEntityList("donation"));
      } else {
        const res = await api.get<any>("/donations");
        if (res.success && res.data) {
          setDonations(Array.isArray(res.data) ? res.data : res.data.data ?? res.data.content ?? []);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const actions: DataTableAction[] = [
    { icon: "view", label: "View", onClick: (row) => console.log("View", row) },
    { icon: "edit", label: "Edit", onClick: (row) => { setEditingRecord(row); setFormOpen(true); } },
  ];

  const customActions = (
    <Button size="sm" className="h-8 text-xs" onClick={() => { setEditingRecord(null); setFormOpen(true); }}>
      <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Donation
    </Button>
  );

  return (
    <div>
      <Card className="p-6">
        <DataTable
          data={donations}
          columns={columns}
          actions={actions}
          searchableFields={searchFields}
          customActions={customActions}
        />
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRecord ? "Edit Donation" : "Add Donation"}</DialogTitle>
            <DialogDescription>{editingRecord ? "Update donation details" : "Create a new donation record"}</DialogDescription>
          </DialogHeader>
          {formOpen && (
            <DynamicEntityForm
              entityName="donation"
              record={editingRecord}
              onClose={() => setFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
