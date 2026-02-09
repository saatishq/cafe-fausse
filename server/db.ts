import { eq, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  customers, 
  reservations, 
  newsletterSubscribers,
  InsertCustomer,
  InsertReservation,
  InsertNewsletterSubscriber,
  Customer,
  Reservation
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== CUSTOMER QUERIES ====================

export async function createCustomer(customer: InsertCustomer): Promise<Customer> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(customers).values(customer);
  const insertId = result[0].insertId;
  
  const [newCustomer] = await db.select().from(customers).where(eq(customers.id, insertId));
  return newCustomer;
}

export async function getCustomerByEmail(email: string): Promise<Customer | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
  return result[0];
}

export async function updateCustomer(id: number, data: Partial<InsertCustomer>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(customers).set(data).where(eq(customers.id, id));
}

// ==================== RESERVATION QUERIES ====================

const TOTAL_TABLES = 30;

export async function getReservationsForTimeSlot(
  date: string, 
  timeSlot: string
): Promise<Reservation[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(reservations)
    .where(
      and(
        eq(reservations.reservationDate, date),
        eq(reservations.timeSlot, timeSlot),
        eq(reservations.status, "confirmed")
      )
    );
}

export async function getAvailableTablesForTimeSlot(
  date: string, 
  timeSlot: string
): Promise<number[]> {
  const existingReservations = await getReservationsForTimeSlot(date, timeSlot);
  const takenTables = new Set(existingReservations.map(r => r.tableNumber));
  
  const availableTables: number[] = [];
  for (let i = 1; i <= TOTAL_TABLES; i++) {
    if (!takenTables.has(i)) {
      availableTables.push(i);
    }
  }
  return availableTables;
}

export async function assignRandomTable(
  date: string, 
  timeSlot: string
): Promise<number | null> {
  const availableTables = await getAvailableTablesForTimeSlot(date, timeSlot);
  
  if (availableTables.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * availableTables.length);
  return availableTables[randomIndex];
}

export async function createReservation(
  reservation: InsertReservation
): Promise<Reservation> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(reservations).values(reservation);
  const insertId = result[0].insertId;
  
  const [newReservation] = await db
    .select()
    .from(reservations)
    .where(eq(reservations.id, insertId));
  
  return newReservation;
}

export async function getReservationsByCustomerId(customerId: number): Promise<Reservation[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(reservations)
    .where(eq(reservations.customerId, customerId));
}

export async function cancelReservation(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(reservations)
    .set({ status: "cancelled" })
    .where(eq(reservations.id, id));
}

export async function getAllReservations(): Promise<(Reservation & { customerName: string; customerEmail: string })[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      id: reservations.id,
      customerId: reservations.customerId,
      reservationDate: reservations.reservationDate,
      timeSlot: reservations.timeSlot,
      tableNumber: reservations.tableNumber,
      guestCount: reservations.guestCount,
      status: reservations.status,
      specialRequests: reservations.specialRequests,
      createdAt: reservations.createdAt,
      updatedAt: reservations.updatedAt,
      customerName: customers.name,
      customerEmail: customers.email,
    })
    .from(reservations)
    .innerJoin(customers, eq(reservations.customerId, customers.id))
    .orderBy(reservations.reservationDate, reservations.timeSlot);

  return result;
}

// ==================== NEWSLETTER QUERIES ====================

export async function subscribeToNewsletter(
  subscriber: InsertNewsletterSubscriber
): Promise<{ success: boolean; alreadySubscribed: boolean }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.insert(newsletterSubscribers).values(subscriber);
    return { success: true, alreadySubscribed: false };
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: true, alreadySubscribed: true };
    }
    throw error;
  }
}

export async function getAllNewsletterSubscribers() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.isActive, true));
}

export async function unsubscribeFromNewsletter(email: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(newsletterSubscribers)
    .set({ isActive: false })
    .where(eq(newsletterSubscribers.email, email));
}
