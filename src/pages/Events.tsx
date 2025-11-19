import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, LayoutGrid, TableIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvents, Event } from "@/store/events";
import { EventForm } from "@/components/events/EventForm";
import EventsTable from "@/components/events/EventsTable";
import { useToast } from "@/hooks/use-toast";

export default function Events() {
  const { events, addEvent, updateEvent } = useEvents();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [meetingTypeFilter, setMeetingTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.participants.some((p) =>
        p.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      event.attendeesList.some((a) =>
        a.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    const matchesMeetingType =
      meetingTypeFilter === "all" || event.meetingType === meetingTypeFilter;

    return matchesSearch && matchesStatus && matchesMeetingType;
  });

  const handleCreateEvent = async (eventData: Omit<Event, "id">) => {
    try {
      await addEvent(eventData);
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEvent = async (eventData: Omit<Event, "id">) => {
    if (!editingEvent) return;
    try {
      await updateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    }
  };

  const handleNotifyUsers = (event: Event) => {
    const modes = event.notificationModes.join(" and ");
    toast({
      title: "Notification Sent",
      description: `Dealers have been notified via ${modes} about "${event.title}"`,
    });
  };

  return (
    <div>
      <Card className="p-6">
        <EventsTable
          searchQuery=""
          statusFilter="all"
          meetingTypeFilter="all"
          onEdit={setEditingEvent}
        />
      </Card>

      {/* Create Event Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <EventForm
            onSubmit={handleCreateEvent}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <EventForm
              event={editingEvent}
              onSubmit={handleUpdateEvent}
              onCancel={() => setEditingEvent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
