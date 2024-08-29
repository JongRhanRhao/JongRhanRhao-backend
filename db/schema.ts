import {
  pgTable,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet('1234567890abcdef', 21);

// Users Table
export const users = pgTable("users", {
  userId: varchar("user_id").default(nanoid()).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(),
});

// Stores Table
export const stores = pgTable("stores", {
  storeId: varchar("store_id").default(nanoid()).primaryKey(),
  ownerId: varchar("owner_id").notNull().references(() => users.userId),
  staffId: varchar("staff_id").notNull().references(() => users.userId),
  name: varchar("name", { length: 255 }).notNull(),
  openTimeBooking: varchar("open_timebooking", { length: 255 }).notNull(),
  cancelReserve: varchar("cancel_reserve", { length: 255 }).notNull(),
});

// Tables Table
export const tables = pgTable("tables", {
  tableId: varchar("table_id").default(nanoid()).primaryKey(),
  storeId: varchar("store_id").notNull().references(() => stores.storeId),
  tableNumber: integer("table_number").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
});

// Favorites Table
export const favorites = pgTable("favorites", {
  favoriteId: varchar("favorite_id").default(nanoid()).primaryKey(),
  customerId: varchar("customer_id").notNull().references(() => users.userId),
  storeId: varchar("store_id").notNull().references(() => stores.storeId),
});

// Reservations Table
export const reservations = pgTable("reservations", {
  reservationId: varchar("reservation_id").default(nanoid()).primaryKey(),
  tableId: varchar("table_id").notNull().references(() => tables.tableId),
  numberOfTable: integer("number_of_table").notNull(),
  customerId: varchar("customer_id").notNull().references(() => users.userId),
  reservationTime: timestamp("reservation_time").notNull(),
  numberOfPeople: integer("number_of_people").notNull(),
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
});