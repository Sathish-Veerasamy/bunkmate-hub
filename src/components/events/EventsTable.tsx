import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil, Settings2, ArrowUpDown, Calendar, MapPin, Users } from "lucide-react";
import { useEvents, Event } from "@/store/events";

type Column = {
  id: string;
  label: string;
  visible: boolean;
};

type EventsTableProps = {
  searchQuery: string;
  statusFilter: string;
  meetingTypeFilter: string;
  onEdit: (event: Event) => void;
};

export default function EventsTable({
  searchQuery,
  statusFilter,
  meetingTypeFilter,
  onEdit,
}: EventsTableProps) {
  const navigate = useNavigate();
  const { events } = useEvents();
  const [sortColumn, setSortColumn] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [columns, setColumns] = useState<Column[]>([
    { id: "title", label: "Title", visible: true },
    { id: "date", label: "Date", visible: true },
    { id: "time", label: "Time", visible: true },
    { id: "venue", label: "Venue", visible: true },
    { id: "meetingType", label: "Meeting Type", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "participants", label: "Participants", visible: true },
    { id: "actions", label: "Actions", visible: true },
  ]);

  const toggleColumn = (columnId: string) => {
    setColumns((cols) =>
      cols.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = events.filter((event) => {
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

    return filtered.sort((a, b) => {
      let aVal: any = a[sortColumn as keyof Event];
      let bVal: any = b[sortColumn as keyof Event];

      if (sortColumn === "date") {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      }

      if (sortColumn === "participants") {
        aVal = a.participants.length;
        bVal = b.participants.length;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [events, searchQuery, statusFilter, meetingTypeFilter, sortColumn, sortDirection]);

  const visibleColumns = columns.filter((col) => col.visible);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns
              .filter((col) => col.id !== "actions")
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.visible}
                  onCheckedChange={() => toggleColumn(column.id)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={column.id}>
                  {column.id !== "actions" ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.id)}
                      className="gap-2 hover:bg-transparent p-0 h-auto font-medium"
                    >
                      {column.label}
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((event) => (
                <TableRow key={event.id}>
                  {visibleColumns.map((column) => {
                    if (column.id === "title") {
                      return (
                        <TableCell key={column.id} className="font-medium">
                          {event.title}
                        </TableCell>
                      );
                    }
                    if (column.id === "date") {
                      return (
                        <TableCell key={column.id}>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(event.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </TableCell>
                      );
                    }
                    if (column.id === "time") {
                      return <TableCell key={column.id}>{event.time}</TableCell>;
                    }
                    if (column.id === "venue") {
                      return (
                        <TableCell key={column.id}>
                          <div className="flex items-start gap-2 max-w-xs">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        </TableCell>
                      );
                    }
                    if (column.id === "meetingType") {
                      return (
                        <TableCell key={column.id}>
                          <Badge variant="outline" className="capitalize">
                            {event.meetingType}
                          </Badge>
                        </TableCell>
                      );
                    }
                    if (column.id === "status") {
                      return (
                        <TableCell key={column.id}>
                          <Badge
                            variant={
                              event.status === "upcoming" ? "default" : "secondary"
                            }
                            className={
                              event.status === "upcoming"
                                ? "bg-accent hover:bg-accent/90 capitalize"
                                : "capitalize"
                            }
                          >
                            {event.status}
                          </Badge>
                        </TableCell>
                      );
                    }
                    if (column.id === "participants") {
                      return (
                        <TableCell key={column.id}>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {event.participants.length}
                          </div>
                        </TableCell>
                      );
                    }
                    if (column.id === "actions") {
                      return (
                        <TableCell key={column.id}>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/events/${event.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(event)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      );
                    }
                    return null;
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
