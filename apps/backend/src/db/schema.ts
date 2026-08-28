import { pgTable, text, timestamp, uuid, real } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const farms = pgTable('farms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  lat: real('lat'),
  lng: real('lng'),
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cropRecords = pgTable('crop_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  imageUrl: text('image_url').notNull(),
  prediction: text('prediction').notNull(),
  confidence: real('confidence').notNull(),
  disease: text('disease'),
  treatment: text('treatment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
