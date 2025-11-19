import { Card } from "@/components/ui/card";
import { CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { useSubscriptions } from "@/store/subscriptions";
import SubscriptionsTable from "@/components/subscriptions/SubscriptionsTable";

export default function Subscriptions() {
  const { subscriptions, getStats } = useSubscriptions();
  const stats = getStats();
  
  const handleAddSubscription = () => {
    // TODO: Open subscription form dialog
    console.log("Add subscription clicked");
  };

  return (
    <div>
      <Card className="p-6">
        <SubscriptionsTable onAddSubscription={handleAddSubscription} />
      </Card>
    </div>
  );
}
