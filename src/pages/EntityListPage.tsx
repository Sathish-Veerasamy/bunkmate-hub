import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import EntityDataTable from "@/components/common/EntityDataTable";

function singularize(s: string) {
  return s.endsWith("s") ? s.slice(0, -1) : s;
}

interface EntityListPageProps {
  entityName?: string;
  label?: string;
  extraActions?: React.ReactNode;
  hideAdd?: boolean;
}

export default function EntityListPage({
  entityName,
  label,
  extraActions,
  hideAdd,
}: EntityListPageProps) {
  const { entity: entityParam } = useParams();
  const navigate = useNavigate();
  const resolvedEntity = entityName || singularize(entityParam || "");
  const displayLabel = label || resolvedEntity.charAt(0).toUpperCase() + resolvedEntity.slice(1);
  const plural = `${resolvedEntity}s`;

  return (
    <div>
      <Card className="p-6">
        <EntityDataTable
          entityName={resolvedEntity}
          label={displayLabel}
          onView={(row) => navigate(`/${plural}/${row.id}/details`)}
          extraActions={extraActions}
          hideAdd={hideAdd}
        />
      </Card>
    </div>
  );
}
