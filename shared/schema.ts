import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cards = pgTable("cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'visa', 'mastercard', 'amex'
  lastFour: text("last_four").notNull(),
  cardholderName: text("cardholder_name").notNull(),
  expiryDate: text("expiry_date").notNull(),
  cardType: text("card_type").notNull(), // 'debit', 'credit', 'platinum'
  balance: decimal("balance", { precision: 12, scale: 2 }).notNull().default("0.00"),
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }),
  gradient: text("gradient").notNull(), // CSS gradient class
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").references(() => cards.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  type: text("type").notNull(), // 'income', 'expense'
  icon: text("icon").notNull(),
});

export const stocks = pgTable("stocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 12, scale: 4 }).notNull(),
  change: decimal("change", { precision: 12, scale: 4 }).notNull(),
  changePercent: decimal("change_percent", { precision: 5, scale: 2 }).notNull(),
  marketCap: text("market_cap"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const portfolioValue = pgTable("portfolio_value", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().default("default_user"),
  theme: text("theme").notNull().default("light"),
  currency: text("currency").notNull().default("USD"),
  preferences: jsonb("preferences"),
});

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  date: true,
});

export const insertStockSchema = createInsertSchema(stocks).omit({
  id: true,
  lastUpdated: true,
});

export const insertPortfolioValueSchema = createInsertSchema(portfolioValue).omit({
  id: true,
  timestamp: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
});

export type Card = typeof cards.$inferSelect;
export type InsertCard = z.infer<typeof insertCardSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Stock = typeof stocks.$inferSelect;
export type InsertStock = z.infer<typeof insertStockSchema>;

export type PortfolioValue = typeof portfolioValue.$inferSelect;
export type InsertPortfolioValue = z.infer<typeof insertPortfolioValueSchema>;

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
