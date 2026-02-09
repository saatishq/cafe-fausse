import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createCustomer,
  getCustomerByEmail,
  updateCustomer,
  createReservation,
  getAvailableTablesForTimeSlot,
  assignRandomTable,
  getReservationsForTimeSlot,
  getAllReservations,
  cancelReservation,
  subscribeToNewsletter,
  getAllNewsletterSubscribers,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Reservation router
  reservation: router({
    // Check availability for a specific date and time slot
    checkAvailability: publicProcedure
      .input(z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
        timeSlot: z.string().regex(/^\d{2}:\d{2}$/, "Time slot must be in HH:MM format"),
      }))
      .query(async ({ input }) => {
        const availableTables = await getAvailableTablesForTimeSlot(input.date, input.timeSlot);
        return {
          available: availableTables.length > 0,
          availableCount: availableTables.length,
          totalTables: 30,
        };
      }),

    // Get all available time slots for a date
    getAvailableSlots: publicProcedure
      .input(z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
      }))
      .query(async ({ input }) => {
        const timeSlots = [
          "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
          "20:00", "20:30", "21:00", "21:30"
        ];
        
        const availability = await Promise.all(
          timeSlots.map(async (slot) => {
            const availableTables = await getAvailableTablesForTimeSlot(input.date, slot);
            return {
              timeSlot: slot,
              available: availableTables.length > 0,
              availableCount: availableTables.length,
            };
          })
        );
        
        return availability;
      }),

    // Create a new reservation
    create: publicProcedure
      .input(z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z.string().optional(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
        timeSlot: z.string().regex(/^\d{2}:\d{2}$/, "Time slot must be in HH:MM format"),
        guestCount: z.number().min(1, "At least 1 guest required").max(10, "Maximum 10 guests per reservation"),
        specialRequests: z.string().optional(),
        newsletterSignup: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        // Check if table is available
        const tableNumber = await assignRandomTable(input.date, input.timeSlot);
        
        if (tableNumber === null) {
          return {
            success: false,
            error: "Sorry, all tables are booked for this time slot. Please select another time.",
          };
        }

        // Create or get customer
        let customer = await getCustomerByEmail(input.email);
        
        if (customer) {
          // Update existing customer info
          await updateCustomer(customer.id, {
            name: input.name,
            phone: input.phone || customer.phone,
            newsletterSignup: input.newsletterSignup || customer.newsletterSignup,
          });
          customer = await getCustomerByEmail(input.email);
        } else {
          // Create new customer
          customer = await createCustomer({
            name: input.name,
            email: input.email,
            phone: input.phone,
            newsletterSignup: input.newsletterSignup,
          });
        }

        if (!customer) {
          return {
            success: false,
            error: "Failed to create customer record.",
          };
        }

        // Create reservation
        const reservation = await createReservation({
          customerId: customer.id,
          reservationDate: input.date,
          timeSlot: input.timeSlot,
          tableNumber,
          guestCount: input.guestCount,
          specialRequests: input.specialRequests,
        });

        return {
          success: true,
          reservation: {
            id: reservation.id,
            date: reservation.reservationDate,
            timeSlot: reservation.timeSlot,
            tableNumber: reservation.tableNumber,
            guestCount: reservation.guestCount,
          },
          message: `Your table has been reserved! Table #${tableNumber} on ${input.date} at ${input.timeSlot}.`,
        };
      }),

    // Get all reservations (admin)
    getAll: publicProcedure.query(async () => {
      return await getAllReservations();
    }),

    // Cancel a reservation
    cancel: publicProcedure
      .input(z.object({
        id: z.number(),
      }))
      .mutation(async ({ input }) => {
        await cancelReservation(input.id);
        return { success: true };
      }),
  }),

  // Newsletter router
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email("Invalid email address"),
        name: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await subscribeToNewsletter({
          email: input.email,
          name: input.name,
        });
        
        if (result.alreadySubscribed) {
          return {
            success: true,
            message: "You're already subscribed to our newsletter!",
          };
        }
        
        return {
          success: true,
          message: "Thank you for subscribing to our newsletter!",
        };
      }),

    // Get all subscribers (admin)
    getAll: publicProcedure.query(async () => {
      return await getAllNewsletterSubscribers();
    }),
  }),
});

export type AppRouter = typeof appRouter;
