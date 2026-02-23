import { Card } from "@/components/ui/card";
import EntityDataTable from "@/components/common/EntityDataTable";

export default function Donations() {
  return (
    <div>
      <Card className="p-6">
        <EntityDataTable entityName="donation" label="Donation" />
      </Card>
    </div>
  );
}
