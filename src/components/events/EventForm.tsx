import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Event, MeetingType, NotificationMode } from "@/store/events";
import { X } from "lucide-react";

interface EventFormProps {
  event?: Event;
  onSubmit: (event: Omit<Event, "id">) => void;
  onCancel: () => void;
}

export function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    date: event?.date || "",
    time: event?.time || "",
    venue: event?.venue || "",
    description: event?.description || "",
    meetingType: event?.meetingType || "internal" as MeetingType,
    participants: event?.participants || [] as string[],
    attendeesList: event?.attendeesList || [] as string[],
    minutesOfMeeting: event?.minutesOfMeeting || "",
    notificationModes: event?.notificationModes || [] as NotificationMode[],
    status: event?.status || "upcoming" as const,
  });

  const [participantInput, setParticipantInput] = useState("");
  const [attendeeInput, setAttendeeInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addParticipant = () => {
    if (participantInput.trim()) {
      setFormData({
        ...formData,
        participants: [...formData.participants, participantInput.trim()],
      });
      setParticipantInput("");
    }
  };

  const removeParticipant = (index: number) => {
    setFormData({
      ...formData,
      participants: formData.participants.filter((_, i) => i !== index),
    });
  };

  const addAttendee = () => {
    if (attendeeInput.trim()) {
      setFormData({
        ...formData,
        attendeesList: [...formData.attendeesList, attendeeInput.trim()],
      });
      setAttendeeInput("");
    }
  };

  const removeAttendee = (index: number) => {
    setFormData({
      ...formData,
      attendeesList: formData.attendeesList.filter((_, i) => i !== index),
    });
  };

  const toggleNotificationMode = (mode: NotificationMode) => {
    setFormData({
      ...formData,
      notificationModes: formData.notificationModes.includes(mode)
        ? formData.notificationModes.filter((m) => m !== mode)
        : [...formData.notificationModes, mode],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meetingType">Meeting Type *</Label>
          <Select
            value={formData.meetingType}
            onValueChange={(value: MeetingType) =>
              setFormData({ ...formData, meetingType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="external">External</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="venue">Venue *</Label>
        <Input
          id="venue"
          value={formData.venue}
          onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Participants</Label>
        <div className="flex gap-2">
          <Input
            value={participantInput}
            onChange={(e) => setParticipantInput(e.target.value)}
            placeholder="Add participant name"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addParticipant())}
          />
          <Button type="button" onClick={addParticipant}>
            Add
          </Button>
        </div>
        {formData.participants.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.participants.map((participant, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-md"
              >
                <span className="text-sm">{participant}</span>
                <button
                  type="button"
                  onClick={() => removeParticipant(index)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Actual Attendees (who joined)</Label>
        <div className="flex gap-2">
          <Input
            value={attendeeInput}
            onChange={(e) => setAttendeeInput(e.target.value)}
            placeholder="Add attendee name"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAttendee())}
          />
          <Button type="button" onClick={addAttendee}>
            Add
          </Button>
        </div>
        {formData.attendeesList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.attendeesList.map((attendee, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-md"
              >
                <span className="text-sm">{attendee}</span>
                <button
                  type="button"
                  onClick={() => removeAttendee(index)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="minutesOfMeeting">Minutes of Meeting</Label>
        <Textarea
          id="minutesOfMeeting"
          value={formData.minutesOfMeeting}
          onChange={(e) =>
            setFormData({ ...formData, minutesOfMeeting: e.target.value })
          }
          rows={4}
          placeholder="Document key discussion points and decisions..."
        />
      </div>

      <div className="space-y-2">
        <Label>Notification Modes</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email"
              checked={formData.notificationModes.includes("email")}
              onCheckedChange={() => toggleNotificationMode("email")}
            />
            <Label htmlFor="email" className="cursor-pointer">
              Email
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="whatsapp"
              checked={formData.notificationModes.includes("whatsapp")}
              onCheckedChange={() => toggleNotificationMode("whatsapp")}
            />
            <Label htmlFor="whatsapp" className="cursor-pointer">
              WhatsApp
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: "upcoming" | "completed" | "cancelled") =>
            setFormData({ ...formData, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{event ? "Update Event" : "Create Event"}</Button>
      </div>
    </form>
  );
}
