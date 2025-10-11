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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage events for active dealers
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-r-none"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-l-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={meetingTypeFilter} onValueChange={setMeetingTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="external">External</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Events View */}
      <Tabs value={viewMode} className="space-y-6">
        <TabsContent value="table" className="mt-0">
          <EventsTable
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            meetingTypeFilter={meetingTypeFilter}
            onEdit={setEditingEvent}
          />
        </TabsContent>

        <TabsContent value="grid" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = `/events/${event.id}`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <Badge
                        variant={event.status === "upcoming" ? "default" : "secondary"}
                        className={
                          event.status === "upcoming"
                            ? "bg-accent hover:bg-accent/90 capitalize"
                            : "capitalize"
                        }
                      >
                        {event.status}
                      </Badge>
                      <Badge variant="outline" className="capitalize">{event.meetingType}</Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
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
                      <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{event.participants.length} participants</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingEvent(event);
                      }}
                    >
                      Edit
                    </Button>
                    {event.status === "upcoming" && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotifyUsers(event);
                        }}
                      >
                        Notify
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

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
