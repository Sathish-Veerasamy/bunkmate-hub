import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserX, Download, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import EntityDataTable from "@/components/common/EntityDataTable";

export default function Dealers() {
  const navigate = useNavigate();

  const extraActions = (
    <>
      <Button variant="outline" size="sm" className="h-8 text-xs">
        <UserX className="h-3.5 w-3.5 mr-1.5" />
        Make Inactive
      </Button>
      <Button variant="outline" size="sm" className="h-8 text-xs">
        <Download className="h-3.5 w-3.5 mr-1.5" />
        Export
      </Button>
      <Button variant="outline" size="sm" className="h-8 text-xs">
        <Upload className="h-3.5 w-3.5 mr-1.5" />
        Import
      </Button>
    </>
  );

  return (
    <div>
      <Card className="p-6">
        <EntityDataTable
          entityName="dealer"
          label="Dealer"
          onView={(dealer) => navigate(`/dealers/${dealer.id}/details`)}
          extraActions={extraActions}
        />
      </Card>
    </div>
  );
}
