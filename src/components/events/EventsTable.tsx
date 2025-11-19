import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Plus, Download, Upload } from "lucide-react";
import { useEvents, Event } from "@/store/events";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/ui/data-table";

type EventsTableProps = {
  searchQuery: string;
  statusFilter: string;
  meetingTypeFilter: string;
  onEdit: (event: Event) => void;
  onAddEvent: () => void;
};

export default function EventsTable({
  searchQuery,
  statusFilter,
  meetingTypeFilter,
  onEdit,
  onAddEvent,
}: EventsTableProps) {
  const navigate = useNavigate();
  const { events } = useEvents();

  // Get unique values for filters
  const uniqueStatuses = Array.from(new Set(events.map(e => e.status)));
  const uniqueMeetingTypes = Array.from(new Set(events.map(e => e.meetingType)));

  const filteredData = useMemo(() => {
    return events.filter((event) => {
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
  }, [events, searchQuery, statusFilter, meetingTypeFilter]);

  const columns: DataTableColumn[] = [
    { 
      id: "title", 
      label: "Title", 
      visible: true,
      render: (value) => <span className="font-medium">{value}</span>
    },
    { 
      id: "date", 
      label: "Date", 
      visible: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {new Date(value).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      )
    },
    { id: "time", label: "Time", visible: true },
    { 
      id: "venue", 
      label: "Venue", 
      visible: true,
      render: (value) => (
        <div className="flex items-start gap-2 max-w-xs">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <span className="truncate">{value}</span>
        </div>
      )
    },
    { 
      id: "meetingType", 
      label: "Meeting Type", 
      visible: true,
      filterable: true,
      filterType: "select",
      filterOptions: uniqueMeetingTypes.map(m => ({ label: m.charAt(0).toUpperCase() + m.slice(1), value: m })),
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {value}
        </Badge>
      )
    },
    { 
      id: "status", 
      label: "Status", 
      visible: true,
      filterable: true,
      filterType: "select",
      filterOptions: uniqueStatuses.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s })),
      render: (value) => (
        <Badge
          variant={value === "upcoming" ? "default" : "secondary"}
          className={
            value === "upcoming"
              ? "bg-accent hover:bg-accent/90 capitalize"
              : "capitalize"
          }
        >
          {value}
        </Badge>
      )
    },
    { 
      id: "participants", 
      label: "Participants", 
      visible: true,
      render: (value: string[]) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          {value.length}
        </div>
      )
    },
    { id: "description", label: "Description", visible: false },
    { id: "attendeesList", label: "Attendees", visible: false, render: (value: string[]) => value.join(", ") },
    { id: "minutesOfMeeting", label: "Minutes", visible: false },
  ];

  const actions: DataTableAction[] = [
    {
      icon: "view",
      label: "View Details",
      onClick: (event) => navigate(`/events/${event.id}`),
    },
    {
      icon: "edit",
      label: "Edit Event",
      onClick: (event) => onEdit(event),
    },
  ];

  const searchableFields = [
    "title",
    "description",
    "venue",
    "meetingType",
    "status",
    "minutesOfMeeting",
  ];

  const customActions = (
    <>
      <Button onClick={onAddEvent} size="sm" className="h-9">
        <Plus className="h-4 w-4 mr-2" />
        Create Event
      </Button>
      <Button variant="outline" size="sm" className="h-9">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button variant="outline" size="sm" className="h-9">
        <Upload className="h-4 w-4 mr-2" />
        Import
      </Button>
    </>
  );

  return (
    <DataTable
      data={filteredData}
      columns={columns}
      actions={actions}
      searchableFields={searchableFields}
      customActions={customActions}
    />
  );
}
