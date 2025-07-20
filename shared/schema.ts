import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sectors = pgTable("sectors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  emoji: text("emoji").notNull(),
  description: text("description"),
  brandCount: integer("brand_count").default(0),
  subnodeCount: integer("subnode_count").default(0),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sectorId: integer("sector_id").references(() => sectors.id),
  integration: text("integration").notNull(), // VaultMesh™, HotStack, FAA.ZONE™
  status: text("status").notNull().default("active"), // active, maintenance, offline
  isCore: boolean("is_core").default(true),
  parentId: integer("parent_id"), // for subnodes
  metadata: jsonb("metadata"), // additional brand data
  createdAt: text("created_at").default("now()"),
});

export const systemStatus = pgTable("system_status", {
  id: serial("id").primaryKey(),
  service: text("service").notNull().unique(),
  status: text("status").notNull(), // online, maintenance, offline
  lastChecked: text("last_checked").default("now()"),
});

export const legalDocuments = pgTable("legal_documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  icon: text("icon").default("📄"),
  category: text("category").notNull().default("legal"),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: text("created_at").default("now()"),
});

export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  category: text("category").notNull().default("documentation"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").default("now()"),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  planName: text("plan_name").notNull(),
  amount: text("amount").notNull(), // stored as string to avoid decimal precision issues
  currency: text("currency").default("USD"),
  paypalOrderId: text("paypal_order_id"),
  status: text("status").notNull().default("pending"), // pending, completed, failed, cancelled
  metadata: jsonb("metadata"), // additional payment data
  createdAt: text("created_at").default("now()"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSectorSchema = createInsertSchema(sectors).omit({
  id: true,
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
});

export const insertSystemStatusSchema = createInsertSchema(systemStatus).omit({
  id: true,
  lastChecked: true,
});

export const insertLegalDocumentSchema = createInsertSchema(legalDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertRepositorySchema = createInsertSchema(repositories).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSector = z.infer<typeof insertSectorSchema>;
export type Sector = typeof sectors.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;
export type InsertSystemStatus = z.infer<typeof insertSystemStatusSchema>;
export type SystemStatus = typeof systemStatus.$inferSelect;
export type InsertLegalDocument = z.infer<typeof insertLegalDocumentSchema>;
export type LegalDocument = typeof legalDocuments.$inferSelect;
export type InsertRepository = z.infer<typeof insertRepositorySchema>;
export type Repository = typeof repositories.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
