import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Mail,
  MessageSquare,
  FileText,
} from "lucide-react";
import { useEvents } from "@/store/events";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events } = useEvents();
  const event = events.find((e) => e.id === parseInt(id!));

  if (!event) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Event not found</p>
            <Button onClick={() => navigate("/events")} className="mt-4">
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/events")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-muted-foreground mt-1">{event.description}</p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant={event.status === "upcoming" ? "default" : "secondary"}
            className={
              event.status === "upcoming"
                ? "bg-accent hover:bg-accent/90 text-lg px-4 py-2 capitalize"
                : "text-lg px-4 py-2 capitalize"
            }
          >
            {event.status}
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2 capitalize">
            {event.meetingType}
          </Badge>
        </div>
      </div>

      {/* Main Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Event Information */}
        <Card>
          <CardHeader>
            <CardTitle>Event Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{event.time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Venue</p>
                <p className="font-medium">{event.venue}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Meeting Type</p>
                <p className="font-medium capitalize">{event.meetingType}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.notificationModes.length > 0 ? (
              <>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Enabled Notification Modes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {event.notificationModes.includes("email") && (
                      <Badge variant="outline" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Badge>
                    )}
                    {event.notificationModes.includes("whatsapp") && (
                      <Badge variant="outline" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        WhatsApp
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No notification modes configured
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle>Participants ({event.participants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {event.participants.map((participant, index) => (
              <Badge key={index} variant="secondary">
                {participant}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendees List */}
      {event.attendeesList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Actual Attendees ({event.attendeesList.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {event.attendeesList.map((attendee, index) => (
                <Badge key={index} variant="default" className="bg-success hover:bg-success/90">
                  {attendee}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Minutes of Meeting */}
      {event.minutesOfMeeting && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Minutes of Meeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{event.minutesOfMeeting}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
