import { id } from "date-fns/locale";
import { relations } from "drizzle-orm";
import { boolean, decimal, index, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { Settings } from "lucide-react";

type PlanType = 'free' | 'basic' | 'full'

export const planEnum = pgEnum('plan_type', ['free', 'basic', 'full']);
export const warrantyStatusEnum = pgEnum('warranty_status', ['active', 'expiring', 'expired']);

const createdAt = timestamp('created_at', {withTimezone: true}).defaultNow().notNull();
const updatedAt = timestamp('updated_at', {withTimezone: true}).defaultNow().notNull().$onUpdate(() => new Date());

export const users = pgTable("users", { 
    id: uuid("id").defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  email: text('email').unique().notNull(),
  plan: planEnum('plan').default('free').notNull(),
  planUpdatedAt: timestamp('plan_updated_at').defaultNow().notNull(),
  storageUsed: integer('storage_used').default(0).notNull(),
  createdAt,
  updatedAt
}, (table) => ({
    clerkIdIdx : index('clerk_id_idx').on(table.clerkId),
    // Index for searching users by email
  emailIdx: index('email_idx').on(table.email),
  // Index for filtering users by plan (useful for admin features)
  planIdx: index('plan_idx').on(table.plan)
}))

// Users can have many warranties
export const usersRelations = relations(users, ({ many }) => ({
  warranties: many(warranties),  // One user can have multiple warranties
  documents: many(documents),    // One user can have multiple documents
  settings: many(userSettings)   // One user can have multiple settings
}));

// User settings table
export const userSettings = pgTable('user_settings', {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .unique()
      .notNull(),
    emailAlerts: boolean('email_alerts').default(true).notNull(),
    inAppAlerts: boolean('in_app_alerts').default(true).notNull(),
    reminderDays: integer('reminder_days').array().default([30, 7, 1]).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  }, (table) => [
    // Index for finding settings by user ID
      index('user_settings_user_id_idx').on(table.userId)
  ]);


  // Warranties table
export const warranties = pgTable('warranties', {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    productName: text('product_name').notNull(),
    brand: text('brand').notNull(),
    modelNumber: text('model_number').notNull(),
    serialNumber: text('serial_number').notNull(),
    purchaseDate: timestamp('purchase_date').notNull(),
    expiryDate: timestamp('expiry_date').notNull(),
    warrantyPeriod: integer('warranty_period').notNull(),
    purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }).default('0'),
    retailerName: text('retailer_name').notNull(),
    retailerContact: text('retailer_contact'),
    notes: text('notes'),
    status: warrantyStatusEnum('status').default('active').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  }, (table) => ({
    // Index for finding warranties by user
    userIdIdx: index('warranties_user_id_idx').on(table.userId),
    // Composite index for filtering warranties by user and status
    userStatusIdx: index('warranties_user_status_idx').on(table.userId, table.status),
    // Index for finding warranties by expiry date (for reminder system)
    expiryIdx: index('warranties_expiry_idx').on(table.expiryDate),
    // Index for searching warranties by brand (for filtering)
    brandIdx: index('warranties_brand_idx').on(table.brand),
    // Index for searching by serial number
    serialNumberIdx: index('warranties_serial_number_idx').on(table.serialNumber),
    // Composite index for expiring warranties by user
    userExpiryIdx: index('warranties_user_expiry_idx').on(table.userId, table.expiryDate)
  }));

// Warranty belongs to one user
export const warrantiesRelations = relations(warranties, ({ one, many }) => ({
  user: one(users, {            // Each warranty belongs to one user
    fields: [warranties.userId], // The foreign key in warranties table
    references: [users.id],      // References the primary key in users table
  }),
  documents: many(documents),    // One warranty can have multiple documents
  claims: many(claims),         // One warranty can have multiple claims
  // events: many(warrantyEvents)  // One warranty can have multiple events
}));


  // Documents table
export const documents = pgTable('documents', {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  warrantyId: text('warranty_id')
    .references(() => warranties.id, { onDelete: 'cascade' })
    .notNull(),
  type: text('type').notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  size: integer('size').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  // Index for finding documents by user
  userIdIdx: index('documents_user_id_idx').on(table.userId),
  // Index for finding documents by warranty
  warrantyIdIdx: index('documents_warranty_id_idx').on(table.warrantyId),
  // Composite index for finding documents by user and type
  userTypeIdx: index('documents_user_type_idx').on(table.userId, table.type)
}));


// Claims table
export const claims = pgTable('claims', {
    id: uuid("id").defaultRandom().primaryKey(),
    warrantyId: text('warranty_id')
      .references(() => warranties.id, { onDelete: 'cascade' })
      .notNull(),
    status: text('status').notNull(),
    description: text('description').notNull(),
    reference: text('reference'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  }, (table) => ({
    // Index for finding claims by warranty
    warrantyIdIdx: index('claims_warranty_id_idx').on(table.warrantyId),
    // Index for filtering claims by status
    statusIdx: index('claims_status_idx').on(table.status),
    // Composite index for finding claims by warranty and status
    warrantyStatusIdx: index('claims_warranty_status_idx').on(table.warrantyId, table.status)
  }));

  // Warranty events table
export const warrantyEvents = pgTable('warranty_events', {
    id: uuid("id").defaultRandom().primaryKey(),
    warrantyId: text('warranty_id')
      .references(() => warranties.id, { onDelete: 'cascade' })
      .notNull(),
    type: text('type').notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
  }, (table) => ({
    // Index for finding events by warranty
    warrantyIdIdx: index('warranty_events_warranty_id_idx').on(table.warrantyId),
    // Composite index for finding events by warranty and type
    warrantyTypeIdx: index('warranty_events_warranty_type_idx').on(table.warrantyId, table.type),
    // Index for finding recent events
    createdAtIdx: index('warranty_events_created_at_idx').on(table.createdAt)
  }));