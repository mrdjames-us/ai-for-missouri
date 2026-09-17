import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RsvpRecord = {
  id: string;
  eventSlug: string;
  name: string;
  email: string;
  town: string;
  role: string;
  notes: string;
  createdAt: string;
};

export type HostRequest = {
  id: string;
  org: string;
  contactName: string;
  email: string;
  town: string;
  format: "hackathon" | "workshop" | "seminar" | "unsure";
  venue: string;
  timing: string;
  notes: string;
  createdAt: string;
};

type RsvpState = {
  rsvps: RsvpRecord[];
  hosts: HostRequest[];
  addRsvp: (input: Omit<RsvpRecord, "id" | "createdAt">) => RsvpRecord;
  hasRsvp: (slug: string) => boolean;
  countFor: (slug: string) => number;
  addHost: (input: Omit<HostRequest, "id" | "createdAt">) => HostRequest;
};

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useRsvpStore = create<RsvpState>()(
  persist(
    (set, get) => ({
      rsvps: [],
      hosts: [],
      addRsvp: (input) => {
        const record: RsvpRecord = {
          ...input,
          id: uid(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ rsvps: [...state.rsvps, record] }));
        return record;
      },
      hasRsvp: (slug) => get().rsvps.some((r) => r.eventSlug === slug),
      countFor: (slug) => get().rsvps.filter((r) => r.eventSlug === slug).length,
      addHost: (input) => {
        const record: HostRequest = {
          ...input,
          id: uid(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ hosts: [...state.hosts, record] }));
        return record;
      },
    }),
    { name: "ai-for-missouri-gatherings" },
  ),
);
