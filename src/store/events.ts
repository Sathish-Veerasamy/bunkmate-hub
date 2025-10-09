import { useState, useEffect } from "react";

export type EventStatus = "upcoming" | "completed" | "cancelled";

export type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  attendees: number;
  status: EventStatus;
};

// Initial mock data - will be replaced with API calls
const initialEvents: Event[] = [
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

// API functions - currently using mock data, will be replaced with actual API calls
export const eventsAPI = {
  getAll: async (): Promise<Event[]> => {
    // TODO: Replace with actual API call
    // return await fetch('/api/events').then(res => res.json());
    return Promise.resolve(initialEvents);
  },

  getById: async (id: number): Promise<Event | undefined> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/events/${id}`).then(res => res.json());
    return Promise.resolve(initialEvents.find((e) => e.id === id));
  },

  create: async (event: Omit<Event, "id">): Promise<Event> => {
    // TODO: Replace with actual API call
    // return await fetch('/api/events', { method: 'POST', body: JSON.stringify(event) }).then(res => res.json());
    const newEvent = { ...event, id: Date.now() };
    return Promise.resolve(newEvent);
  },

  update: async (id: number, event: Partial<Event>): Promise<Event> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(event) }).then(res => res.json());
    const existing = initialEvents.find((e) => e.id === id);
    return Promise.resolve({ ...existing!, ...event });
  },

  delete: async (id: number): Promise<void> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/events/${id}`, { method: 'DELETE' });
    return Promise.resolve();
  },
};

// Custom hook for managing events state
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getAll();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event: Omit<Event, "id">) => {
    try {
      const newEvent = await eventsAPI.create(event);
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError("Failed to add event");
      throw err;
    }
  };

  const updateEvent = async (id: number, event: Partial<Event>) => {
    try {
      const updated = await eventsAPI.update(id, event);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      return updated;
    } catch (err) {
      setError("Failed to update event");
      throw err;
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      await eventsAPI.delete(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError("Failed to delete event");
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}
