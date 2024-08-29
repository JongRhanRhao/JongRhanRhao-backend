import {
    pgTable,
    serial,
    varchar,
    integer,
    timestamp,
  } from "drizzle-orm/pg-core";
  
  // Users Table
  export const users = pgTable("users", {
    userId: serial("user_id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 }).notNull(),
  });
  
  // Stores Table
  export const stores = pgTable("stores", {
    storeId: serial("store_id").primaryKey(),
    ownerId: integer("owner_id").notNull().references(() => users.userId),
    staffId: integer("staff_id").notNull().references(() => users.userId),
    name: varchar("name", { length: 255 }).notNull(),
    openTimeBooking: varchar("open_timebooking", { length: 255 }).notNull(),
    cancelReserve: varchar("cancel_reserve", { length: 255 }).notNull(),
  });
  
  // Tables Table
  export const tables = pgTable("tables", {
    tableId: serial("table_id").primaryKey(),
    storeId: integer("store_id").notNull().references(() => stores.storeId),
    tableNumber: integer("table_number").notNull(),
    status: varchar("status", { length: 20 }).notNull(),
  });
  
  // Favorites Table
  export const favorites = pgTable("favorites", {
    favoriteId: serial("favorite_id").primaryKey(),
    customerId: integer("customer_id").notNull().references(() => users.userId),
    storeId: integer("store_id").notNull().references(() => stores.storeId),
  });
  
  // Reservations Table
  export const reservations = pgTable("reservations", {
    reservationId: serial("reservation_id").primaryKey(),
    tableId: integer("table_id").notNull().references(() => tables.tableId),
    numberOfTable: integer("number_of_table").notNull(),
    customerId: integer("customer_id").notNull().references(() => users.userId),
    reservationTime: timestamp("reservation_time").notNull(),
    numberOfPeople: integer("number_of_people").notNull(),
    customerName: varchar("customer_name", { length: 100 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  });