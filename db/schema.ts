import { is, sql } from "drizzle-orm";

import {
  pgTable,
  varchar,
  integer,
  date,
  time,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  userId: varchar("user_id")
    .default(sql`generate_nanoid()`)
    .primaryKey(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }),
  role: varchar("role", { length: 20 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 15 }),
  googleId: varchar("google_id", { length: 255 }),
});

// Roles Table
export const roles = pgTable("roles", {
  roleId: varchar("role_id")
    .default(sql`generate_nanoid()`)
    .primaryKey(),
  roleName: varchar("role_name", { length: 50 }).notNull(),
});

// UserRoles Table (many-to-many relationship between Users and Roles)
export const userRoles = pgTable("userroles", {
  userRoleId: varchar("userrole_id")
    .default(sql`generate_nanoid()`)
    .primaryKey(),
  userId: varchar("user_id")
    .references(() => users.userId)
    .notNull(),
  roleId: varchar("role_id")
    .references(() => roles.roleId)
    .notNull(),
  shopId: varchar("shop_id").references(() => stores.storeId),
});

// Stores Table
export const stores = pgTable("stores", {
  storeId: varchar("store_id")
    .default(sql`generate_nanoid()`)
    .primaryKey(),
  ownerId: varchar("owner_id").references(() => users.userId),
  staffId: varchar("staff_id").references(() => users.userId),
  shopName: varchar("shop_name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  rating: integer("rating").default(0),
  imageUrl: varchar("image_url", { length: 255 }),
  openTimeBooking: varchar("open_timebooking", { length: 255 }).notNull(),
  cancelReserve: varchar("cancel_reserve", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull(),
  maxSeats: integer("max_seats").notNull(),
  currSeats: integer("curr_seats").notNull(),
  isPopular: boolean("is_popular").default(false),
  type: varchar("type", { length: 50 }), // Add type field
});

// Reviews Table (expanded for comments and likes)
export const reviewsTable = pgTable("reviews", {
  reviewId: varchar("review_id")
    .default(sql`generate_nanoid()`)
    .primaryKey(),
  shopId: varchar("shop_id")
    .references(() => stores.storeId)
    .notNull(),
  customerId: varchar("customer_id")
    .references(() => users.userId)
    .notNull(),
  rating: integer("rating").notNull(),
  reviewText: varchar("review_text", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  likes: integer("likes").default(0), // Add likes field
  replies: integer("replies").default(0), // Add replies field
  avatarUrl: varchar("avatar_url", { length: 255 }), // Add avatar field
});

// StoreImages Table
export const storeImages = pgTable("store_images", {
  imageId: varchar("image_id")
    .default(sql`generate_nanoid()`)
    .primaryKey(),
  storeId: varchar("store_id")
    .references(() => stores.storeId)
    .notNull(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
});

// Staff Table
export const staff = pgTable("staff", {
  staffId: varchar("staff_id")
    .default(sql`generate_nanoid()`)
    .primaryKey(),
  shopId: varchar("shop_id")
    .references(() => stores.storeId)
    .notNull(),
  staffUserId: varchar("staff_user_id")
    .references(() => users.userId)
    .notNull(),
});

// Reservations Table
export const reservations = pgTable("reservations", {
  reservationId: varchar("reservation_id").primaryKey(),
  customerId: varchar("customer_id")
    .references(() => users.userId)
    .notNull(),
  shopId: varchar("shop_id")
    .references(() => stores.storeId)
    .notNull(),
  reservationDate: date("reservation_date").notNull(),
  reservationTime: varchar("reservation_time", { length: 255 }),
  reservationStatus: varchar("reservation_status", { length: 50 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 10 }),
});

// Favorites Table
export const favorites = pgTable("favorites", {
  favoriteId: varchar("favorite_id")
    .default(sql`generate_nanoid()`)
    .primaryKey(),
  customerId: varchar("customer_id")
    .references(() => users.userId)
    .notNull(),
  storeId: varchar("store_id")
    .references(() => stores.storeId)
    .notNull(),
});
