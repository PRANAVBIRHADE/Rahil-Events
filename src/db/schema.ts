import { pgTable, text, timestamp, integer, boolean, pgEnum, uuid, json } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['PARTICIPANT', 'ADMIN']);
export const registrationStatusEnum = pgEnum('registration_status', ['PENDING', 'APPROVED', 'REJECTED']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password'),
  college: text('college'),
  branch: text('branch'),
  phone: text('phone'),
  role: userRoleEnum('role').default('PARTICIPANT'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  tagline: text('tagline'),
  description: text('description'),
  fee: integer('fee').notNull(),
  schedule: text('schedule'),
  venue: text('venue'),
  branch: text('branch'),
  format: text('format').default('SOLO'),
  isCommon: boolean('is_common').default(false),
  teamSize: integer('team_size').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

export const registrations = pgTable('registrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  eventId: uuid('event_id').references(() => events.id).notNull(),
  teamName: text('team_name'),
  members: json('members'),
  paymentScreenshot: text('payment_screenshot'),
  transactionId: text('transaction_id'),
  status: registrationStatusEnum('status').default('PENDING'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const announcements = pgTable('announcements', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  isActive: boolean('is_active').default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
});
