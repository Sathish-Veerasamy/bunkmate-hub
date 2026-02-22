import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/ui/data-table";
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

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

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

  const columns: DataTableColumn[] = [
    { id: "title", label: "Title", visible: true },
    {
      id: "status", label: "Status", visible: true, filterable: true, filterType: "select",
      filterOptions: [
        { label: "Pending", value: "Pending" },
        { label: "In Progress", value: "In Progress" },
        { label: "Completed", value: "Completed" },
      ],
      render: (value: string) => {
        const colors: Record<string, string> = {
          Pending: "bg-amber-100 text-amber-800",
          Completed: "bg-green-100 text-green-800",
          "In Progress": "bg-blue-100 text-blue-800",
        };
        return <Badge variant="secondary" className={colors[value] || ""}>{value}</Badge>;
      },
    },
    {
      id: "priority", label: "Priority", visible: true, filterable: true, filterType: "select",
      filterOptions: [
        { label: "High", value: "High" },
        { label: "Medium", value: "Medium" },
        { label: "Low", value: "Low" },
      ],
      render: (value: string) => {
        const colors: Record<string, string> = {
          High: "bg-red-100 text-red-800",
          Medium: "bg-amber-100 text-amber-800",
          Low: "bg-green-100 text-green-800",
        };
        return <Badge variant="secondary" className={colors[value] || ""}>{value}</Badge>;
      },
    },
    { id: "assignedTo", label: "Assigned To", visible: true },
    { id: "dueDate", label: "Due Date", visible: true },
    { id: "createdAt", label: "Created", visible: true },
  ];

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
          searchableFields={["title", "status", "assignedTo", "priority"]}
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
