import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sampleEvents = [
  {
    id: 1,
    title: "Annual General Meeting 2025",
    date: "2025-11-15",
    time: "10:00 AM",
    venue: "DDPWA Office, Main Road, Dindigul",
    description: "Annual general meeting for all active dealers",
    attendees: 45,
    status: "upcoming",
  },
  {
    id: 2,
    title: "Safety Training Workshop",
    date: "2025-10-20",
    time: "2:00 PM",
    venue: "Community Hall, Market Street",
    description: "Mandatory safety training for all petroleum dealers",
    attendees: 32,
    status: "upcoming",
  },
  {
    id: 3,
    title: "District Coordination Meet",
    date: "2025-09-10",
    time: "11:00 AM",
    venue: "District Collector Office",
    description: "Coordination meeting with district administration",
    attendees: 28,
    status: "completed",
  },
];

export default function Events() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage events for active dealers
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleEvents.map((event) => (
          <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex justify-between items-start">
                <Badge
                  variant={event.status === "upcoming" ? "default" : "secondary"}
                  className={
                    event.status === "upcoming"
                      ? "bg-accent hover:bg-accent/90"
                      : ""
                  }
                >
                  {event.status === "upcoming" ? "Upcoming" : "Completed"}
                </Badge>
              </div>

              {/* Event Title */}
              <div>
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {event.description}
                </p>
              </div>

              {/* Event Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    at {event.time}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} attendees</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                {event.status === "upcoming" && (
                  <Button size="sm" className="flex-1">
                    Notify Dealers
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
