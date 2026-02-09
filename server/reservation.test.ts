import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getAvailableTablesForTimeSlot: vi.fn(),
  assignRandomTable: vi.fn(),
  getCustomerByEmail: vi.fn(),
  createCustomer: vi.fn(),
  updateCustomer: vi.fn(),
  createReservation: vi.fn(),
  subscribeToNewsletter: vi.fn(),
  getAllNewsletterSubscribers: vi.fn(),
  getAllReservations: vi.fn(),
}));

import {
  getAvailableTablesForTimeSlot,
  assignRandomTable,
  getCustomerByEmail,
  createCustomer,
  updateCustomer,
  createReservation,
  subscribeToNewsletter,
} from "./db";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("reservation.checkAvailability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns availability status for a time slot", async () => {
    vi.mocked(getAvailableTablesForTimeSlot).mockResolvedValue([1, 2, 3, 4, 5]);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reservation.checkAvailability({
      date: "2026-02-10",
      timeSlot: "19:00",
    });

    expect(result).toEqual({
      available: true,
      availableCount: 5,
      totalTables: 30,
    });
    expect(getAvailableTablesForTimeSlot).toHaveBeenCalledWith("2026-02-10", "19:00");
  });

  it("returns not available when no tables left", async () => {
    vi.mocked(getAvailableTablesForTimeSlot).mockResolvedValue([]);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reservation.checkAvailability({
      date: "2026-02-10",
      timeSlot: "19:00",
    });

    expect(result).toEqual({
      available: false,
      availableCount: 0,
      totalTables: 30,
    });
  });
});

describe("reservation.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a reservation successfully for new customer", async () => {
    vi.mocked(assignRandomTable).mockResolvedValue(15);
    vi.mocked(getCustomerByEmail).mockResolvedValue(undefined);
    vi.mocked(createCustomer).mockResolvedValue({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "555-1234",
      newsletterSignup: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(createReservation).mockResolvedValue({
      id: 100,
      customerId: 1,
      reservationDate: "2026-02-10",
      timeSlot: "19:00",
      tableNumber: 15,
      guestCount: 4,
      status: "confirmed",
      specialRequests: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reservation.create({
      name: "John Doe",
      email: "john@example.com",
      phone: "555-1234",
      date: "2026-02-10",
      timeSlot: "19:00",
      guestCount: 4,
      newsletterSignup: false,
    });

    expect(result.success).toBe(true);
    expect(result.reservation).toBeDefined();
    expect(result.reservation?.tableNumber).toBe(15);
    expect(createCustomer).toHaveBeenCalled();
  });

  it("returns error when no tables available", async () => {
    vi.mocked(assignRandomTable).mockResolvedValue(null);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reservation.create({
      name: "John Doe",
      email: "john@example.com",
      date: "2026-02-10",
      timeSlot: "19:00",
      guestCount: 4,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("all tables are booked");
  });

  it("updates existing customer when email exists", async () => {
    vi.mocked(assignRandomTable).mockResolvedValue(10);
    vi.mocked(getCustomerByEmail)
      .mockResolvedValueOnce({
        id: 5,
        name: "John Doe",
        email: "john@example.com",
        phone: "555-1234",
        newsletterSignup: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .mockResolvedValueOnce({
        id: 5,
        name: "John Smith",
        email: "john@example.com",
        phone: "555-9999",
        newsletterSignup: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    vi.mocked(updateCustomer).mockResolvedValue();
    vi.mocked(createReservation).mockResolvedValue({
      id: 101,
      customerId: 5,
      reservationDate: "2026-02-10",
      timeSlot: "20:00",
      tableNumber: 10,
      guestCount: 2,
      status: "confirmed",
      specialRequests: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reservation.create({
      name: "John Smith",
      email: "john@example.com",
      phone: "555-9999",
      date: "2026-02-10",
      timeSlot: "20:00",
      guestCount: 2,
      newsletterSignup: true,
    });

    expect(result.success).toBe(true);
    expect(updateCustomer).toHaveBeenCalled();
    expect(createCustomer).not.toHaveBeenCalled();
  });
});

describe("newsletter.subscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("subscribes a new email successfully", async () => {
    vi.mocked(subscribeToNewsletter).mockResolvedValue({
      success: true,
      alreadySubscribed: false,
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.subscribe({
      email: "test@example.com",
      name: "Test User",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("Thank you for subscribing");
    expect(subscribeToNewsletter).toHaveBeenCalledWith({
      email: "test@example.com",
      name: "Test User",
    });
  });

  it("handles already subscribed email", async () => {
    vi.mocked(subscribeToNewsletter).mockResolvedValue({
      success: true,
      alreadySubscribed: true,
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.subscribe({
      email: "existing@example.com",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("already subscribed");
  });
});

describe("reservation input validation", () => {
  it("rejects invalid date format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reservation.checkAvailability({
        date: "02-10-2026", // Wrong format
        timeSlot: "19:00",
      })
    ).rejects.toThrow();
  });

  it("rejects invalid time slot format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reservation.checkAvailability({
        date: "2026-02-10",
        timeSlot: "7:00 PM", // Wrong format
      })
    ).rejects.toThrow();
  });

  it("rejects invalid email in reservation", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reservation.create({
        name: "John Doe",
        email: "not-an-email",
        date: "2026-02-10",
        timeSlot: "19:00",
        guestCount: 2,
      })
    ).rejects.toThrow();
  });

  it("rejects guest count over 10", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reservation.create({
        name: "John Doe",
        email: "john@example.com",
        date: "2026-02-10",
        timeSlot: "19:00",
        guestCount: 15,
      })
    ).rejects.toThrow();
  });
});
