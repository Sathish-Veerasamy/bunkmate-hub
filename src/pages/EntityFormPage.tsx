import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DynamicEntityForm from "@/components/common/DynamicEntityForm";

function toTitle(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function EntityFormPage() {
  const { entity: entityParam, id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Supports both routes:
  // 1) /:entity/new, /:entity/:id/edit
  // 2) /dealers/new, /dealers/:id/edit
  const pathSegments = pathname.split("/").filter(Boolean);
  const rawEntity = entityParam || pathSegments[0] || "";
  const entityName = rawEntity.endsWith("s") ? rawEntity.slice(0, -1) : rawEntity;

  const isEdit = !!id;
  const label = toTitle(entityName);

  const handleSuccess = () => {
    if (!rawEntity) {
      navigate("/", { replace: true });
      return;
    }

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
