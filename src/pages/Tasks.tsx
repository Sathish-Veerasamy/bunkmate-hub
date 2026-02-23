import { Card } from "@/components/ui/card";
import EntityDataTable from "@/components/common/EntityDataTable";

export default function Tasks() {
  return (
    <div>
      <Card className="p-6">
        <EntityDataTable entityName="task" label="Task" />
      </Card>
    </div>
  );
}
