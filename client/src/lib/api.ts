/**
 * API client for the Flask backend.
 * Replaces tRPC calls with standard fetch requests to Flask REST endpoints.
 */

const API_BASE = "/api";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok && !data.success) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

// ==================== Reservation API ====================

export interface AvailabilityResult {
  available: boolean;
  availableCount: number;
  totalTables: number;
}

export interface SlotAvailability {
  timeSlot: string;
  available: boolean;
  availableCount: number;
}

export interface ReservationDetails {
  id: number;
  date: string;
  timeSlot: string;
  tableNumber: number;
  guestCount: number;
}

export interface CreateReservationResult {
  success: boolean;
  reservation?: ReservationDetails;
  message?: string;
  error?: string;
}

export interface CreateReservationInput {
  name: string;
  email: string;
  phone?: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  specialRequests?: string;
  newsletterSignup?: boolean;
}

export const reservationApi = {
  checkAvailability: (date: string, timeSlot: string): Promise<AvailabilityResult> =>
    fetchJSON(`/reservations/check-availability?date=${encodeURIComponent(date)}&timeSlot=${encodeURIComponent(timeSlot)}`),

  getAvailableSlots: (date: string): Promise<SlotAvailability[]> =>
    fetchJSON(`/reservations/available-slots?date=${encodeURIComponent(date)}`),

  create: (input: CreateReservationInput): Promise<CreateReservationResult> =>
    fetchJSON("/reservations/create", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  cancel: (id: number): Promise<{ success: boolean }> =>
    fetchJSON("/reservations/cancel", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
};

// ==================== Newsletter API ====================

export interface NewsletterResult {
  success: boolean;
  message: string;
}

export const newsletterApi = {
  subscribe: (email: string, name?: string): Promise<NewsletterResult> =>
    fetchJSON("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email, name }),
    }),
};
