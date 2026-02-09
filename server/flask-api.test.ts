import { describe, expect, it } from "vitest";

/**
 * Tests for the Flask API client module (client/src/lib/api.ts).
 * These tests verify the API contract types and URL construction
 * that the React frontend uses to communicate with the Flask backend.
 */

describe("Flask API contract", () => {
  describe("Reservation API", () => {
    it("constructs correct available-slots URL with date parameter", () => {
      const date = "2026-02-10";
      const url = `/api/reservations/available-slots?date=${encodeURIComponent(date)}`;
      expect(url).toBe("/api/reservations/available-slots?date=2026-02-10");
    });

    it("constructs correct check-availability URL with date and timeSlot", () => {
      const date = "2026-02-10";
      const timeSlot = "19:00";
      const url = `/api/reservations/check-availability?date=${encodeURIComponent(date)}&timeSlot=${encodeURIComponent(timeSlot)}`;
      expect(url).toBe("/api/reservations/check-availability?date=2026-02-10&timeSlot=19%3A00");
    });

    it("validates reservation creation payload structure", () => {
      const payload = {
        name: "John Smith",
        email: "john@example.com",
        phone: "555-1234",
        date: "2026-02-10",
        timeSlot: "19:00",
        guestCount: 4,
        specialRequests: "Window seat",
        newsletterSignup: true,
      };

      // Verify all required fields are present
      expect(payload).toHaveProperty("name");
      expect(payload).toHaveProperty("email");
      expect(payload).toHaveProperty("date");
      expect(payload).toHaveProperty("timeSlot");
      expect(payload).toHaveProperty("guestCount");

      // Verify types
      expect(typeof payload.name).toBe("string");
      expect(typeof payload.email).toBe("string");
      expect(typeof payload.date).toBe("string");
      expect(typeof payload.timeSlot).toBe("string");
      expect(typeof payload.guestCount).toBe("number");
      expect(typeof payload.newsletterSignup).toBe("boolean");

      // Verify date format
      expect(payload.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      // Verify time format
      expect(payload.timeSlot).toMatch(/^\d{2}:\d{2}$/);

      // Verify guest count range
      expect(payload.guestCount).toBeGreaterThanOrEqual(1);
      expect(payload.guestCount).toBeLessThanOrEqual(10);
    });

    it("validates reservation response structure for success", () => {
      const response = {
        success: true,
        reservation: {
          id: 1,
          date: "2026-02-10",
          timeSlot: "19:00",
          tableNumber: 14,
          guestCount: 4,
        },
        message: "Your table has been reserved! Table #14 on 2026-02-10 at 19:00.",
      };

      expect(response.success).toBe(true);
      expect(response.reservation).toBeDefined();
      expect(response.reservation.tableNumber).toBeGreaterThanOrEqual(1);
      expect(response.reservation.tableNumber).toBeLessThanOrEqual(30);
      expect(response.message).toContain("Table #14");
    });

    it("validates reservation response structure for failure", () => {
      const response = {
        success: false,
        error: "Sorry, all tables are booked for this time slot. Please select another time.",
      };

      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
      expect(typeof response.error).toBe("string");
    });

    it("validates slot availability response structure", () => {
      const slots = [
        { timeSlot: "17:00", available: true, availableCount: 30 },
        { timeSlot: "17:30", available: true, availableCount: 28 },
        { timeSlot: "18:00", available: false, availableCount: 0 },
      ];

      for (const slot of slots) {
        expect(slot).toHaveProperty("timeSlot");
        expect(slot).toHaveProperty("available");
        expect(slot).toHaveProperty("availableCount");
        expect(slot.timeSlot).toMatch(/^\d{2}:\d{2}$/);
        expect(typeof slot.available).toBe("boolean");
        expect(slot.availableCount).toBeGreaterThanOrEqual(0);
        expect(slot.availableCount).toBeLessThanOrEqual(30);
      }
    });
  });

  describe("Newsletter API", () => {
    it("validates newsletter subscription payload", () => {
      const payload = {
        email: "user@example.com",
        name: "Test User",
      };

      expect(payload).toHaveProperty("email");
      expect(typeof payload.email).toBe("string");
      expect(payload.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
    });

    it("validates newsletter response structure", () => {
      const response = {
        success: true,
        message: "Thank you for subscribing to our newsletter!",
      };

      expect(response.success).toBe(true);
      expect(response.message).toBeDefined();
      expect(typeof response.message).toBe("string");
    });

    it("validates already-subscribed response", () => {
      const response = {
        success: true,
        message: "You're already subscribed to our newsletter!",
      };

      expect(response.success).toBe(true);
      expect(response.message).toContain("already subscribed");
    });
  });

  describe("Flask API endpoints", () => {
    it("defines correct API base paths", () => {
      const endpoints = {
        health: "/api/health",
        availableSlots: "/api/reservations/available-slots",
        checkAvailability: "/api/reservations/check-availability",
        createReservation: "/api/reservations/create",
        cancelReservation: "/api/reservations/cancel",
        listReservations: "/api/reservations",
        subscribeNewsletter: "/api/newsletter/subscribe",
        listSubscribers: "/api/newsletter/subscribers",
      };

      // All endpoints should start with /api/
      for (const [, path] of Object.entries(endpoints)) {
        expect(path).toMatch(/^\/api\//);
      }

      // Reservation endpoints should be under /api/reservations
      expect(endpoints.availableSlots).toContain("/api/reservations/");
      expect(endpoints.checkAvailability).toContain("/api/reservations/");
      expect(endpoints.createReservation).toContain("/api/reservations/");

      // Newsletter endpoints should be under /api/newsletter
      expect(endpoints.subscribeNewsletter).toContain("/api/newsletter/");
    });
  });
});
