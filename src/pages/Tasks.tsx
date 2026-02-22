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

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const { columns, searchFields } = useMetaColumns("task");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (USE_MOCK) {
        setTasks(getMockEntityList("task"));
      } else {
        const res = await api.get<any>("/tasks");
        if (res.success && res.data) {
          setTasks(Array.isArray(res.data) ? res.data : res.data.data ?? res.data.content ?? []);
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
      <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Task
    </Button>
  );

  return (
    <div>
      <Card className="p-6">
        <DataTable
          data={tasks}
          columns={columns}
          actions={actions}
          searchableFields={searchFields}
          customActions={customActions}
        />
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRecord ? "Edit Task" : "Add Task"}</DialogTitle>
            <DialogDescription>{editingRecord ? "Update task details" : "Create a new task"}</DialogDescription>
          </DialogHeader>
          {formOpen && (
            <DynamicEntityForm
              entityName="task"
              record={editingRecord}
              onClose={() => setFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
