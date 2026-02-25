import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DynamicEntityForm from "@/components/common/DynamicEntityForm";

function toTitle(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function EntityFormPage() {
  const { entity, id } = useParams();
  const navigate = useNavigate();
  // Route param is plural (e.g. "dealers"), strip trailing 's' for entity name
  const rawEntity = entity || "";
  const entityName = rawEntity.endsWith("s") ? rawEntity.slice(0, -1) : rawEntity;
  const isEdit = !!id;
  const label = toTitle(entityName);

  // For edit mode, we'd need to fetch the record. For now pass undefined (DynamicEntityForm handles it via record prop).
  // A real implementation would fetch the record here. Currently the form works for create mode.

  const handleSuccess = () => {
    if (isEdit) {
      navigate(`/${rawEntity}/${id}/details`, { replace: true });
    } else {
      navigate(`/${rawEntity}`, { replace: true });
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">
            {isEdit ? `Edit ${label}` : `New ${label}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEdit ? `Update ${entityName} details` : `Create a new ${entityName} record`}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DynamicEntityForm
            entityName={entityName}
            record={undefined}
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
