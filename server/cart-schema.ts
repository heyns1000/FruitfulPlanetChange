/**
 * Shopping Cart Database Schema
 * Implements cart, cart items, and order management
 */

import { pgTable, uuid, varchar, decimal, integer, timestamp, boolean, text, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/* User Table (if not already exists) */

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  role: varchar('role', { length: 50 }).default('customer'),
  isActive: boolean('is_active').default(true),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    emailIdx: index('users_email_idx').on(table.email),
    roleIdx: index('users_role_idx').on(table.role),
  };
});

/* Product Table (if not already exists) */

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: varchar('brand_id', { length: 100 }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  longDescription: text('long_description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD'),
  category: varchar('category', { length: 100 }).notNull(),
  tags: text('tags'), // JSON array stored as text
  features: text('features'), // JSON array stored as text
  images: text('images'), // JSON array stored as text
  downloadUrl: varchar('download_url', { length: 500 }),
  version: varchar('version', { length: 50 }).default('1.0.0'),
  license: varchar('license', { length: 100 }).default('Commercial'),
  requirements: text('requirements'), // JSON array stored as text
  compatibility: text('compatibility'), // JSON array stored as text
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  reviewCount: integer('review_count').default(0),
  downloadCount: integer('download_count').default(0),
  isActive: boolean('is_active').default(true),
  isPremium: boolean('is_premium').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    slugIdx: index('products_slug_idx').on(table.slug),
    categoryIdx: index('products_category_idx').on(table.category),
    priceIdx: index('products_price_idx').on(table.price),
    activeIdx: index('products_active_idx').on(table.isActive),
  };
});

/* Shopping Cart Table */

export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 255 }), // For guest carts
  status: varchar('status', { length: 50 }).default('active'), // active, abandoned, converted
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'), // Auto-delete after 30 days
}, (table) => {
  return {
    userIdx: index('carts_user_idx').on(table.userId),
    sessionIdx: index('carts_session_idx').on(table.sessionId),
    statusIdx: index('carts_status_idx').on(table.status),
    expiresIdx: index('carts_expires_idx').on(table.expiresAt),
  };
});

/* Cart Items Table */

export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cartId: uuid('cart_id').references(() => carts.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer('quantity').default(1).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(), // Price at time of adding
  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (table) => {
  return {
    cartIdx: index('cart_items_cart_idx').on(table.cartId),
    productIdx: index('cart_items_product_idx').on(table.productId),
  };
});

/* Orders Table */

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  // Status: pending, paid, processing, completed, failed, refunded, cancelled
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).default('0'),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD'),
  paymentMethod: varchar('payment_method', { length: 50 }), // paypal, stripe, payfast
  paymentId: varchar('payment_id', { length: 255 }), // External payment ID
  paymentStatus: varchar('payment_status', { length: 50 }),
  billingEmail: varchar('billing_email', { length: 255 }).notNull(),
  billingName: varchar('billing_name', { length: 255 }),
  billingAddress: text('billing_address'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  paidAt: timestamp('paid_at'),
  completedAt: timestamp('completed_at'),
}, (table) => {
  return {
    orderNumberIdx: index('orders_order_number_idx').on(table.orderNumber),
    userIdx: index('orders_user_idx').on(table.userId),
    statusIdx: index('orders_status_idx').on(table.status),
    paymentMethodIdx: index('orders_payment_method_idx').on(table.paymentMethod),
    createdIdx: index('orders_created_idx').on(table.createdAt),
  };
});

/* Order Items Table */

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(), // Snapshot at purchase
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(), // Price at time of purchase
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
}, (table) => {
  return {
    orderIdx: index('order_items_order_idx').on(table.orderId),
    productIdx: index('order_items_product_idx').on(table.productId),
  };
});

/* Download Links Table */

export const downloads = pgTable('downloads', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  maxDownloads: integer('max_downloads').default(3),
  downloadCount: integer('download_count').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    tokenIdx: index('downloads_token_idx').on(table.token),
    orderIdx: index('downloads_order_idx').on(table.orderId),
    userIdx: index('downloads_user_idx').on(table.userId),
    expiresIdx: index('downloads_expires_idx').on(table.expiresAt),
  };
});

/* Download Logs Table */

export const downloadLogs = pgTable('download_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  downloadId: uuid('download_id').references(() => downloads.id, { onDelete: 'cascade' }).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  downloadedAt: timestamp('downloaded_at').defaultNow().notNull(),
}, (table) => {
  return {
    downloadIdx: index('download_logs_download_idx').on(table.downloadId),
    downloadedIdx: index('download_logs_downloaded_idx').on(table.downloadedAt),
  };
});

/* Licenses Table */

export const licenses = pgTable('licenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  licenseKey: varchar('license_key', { length: 255 }).notNull().unique(),
  type: varchar('type', { length: 50 }).default('single'), // single, multi, unlimited
  maxActivations: integer('max_activations').default(1),
  currentActivations: integer('current_activations').default(0),
  expiresAt: timestamp('expires_at'), // null = lifetime
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  revokedAt: timestamp('revoked_at'),
}, (table) => {
  return {
    licenseKeyIdx: index('licenses_license_key_idx').on(table.licenseKey),
    orderIdx: index('licenses_order_idx').on(table.orderId),
    userIdx: index('licenses_user_idx').on(table.userId),
    activeIdx: index('licenses_active_idx').on(table.isActive),
  };
});

/* License Activations Table */

export const licenseActivations = pgTable('license_activations', {
  id: uuid('id').primaryKey().defaultRandom(),
  licenseId: uuid('license_id').references(() => licenses.id, { onDelete: 'cascade' }).notNull(),
  deviceId: varchar('device_id', { length: 255 }).notNull(),
  deviceInfo: text('device_info'), // JSON with device details
  activatedAt: timestamp('activated_at').defaultNow().notNull(),
  lastChecked: timestamp('last_checked').defaultNow(),
  isActive: boolean('is_active').default(true),
  deactivatedAt: timestamp('deactivated_at'),
}, (table) => {
  return {
    licenseIdx: index('license_activations_license_idx').on(table.licenseId),
    deviceIdx: index('license_activations_device_idx').on(table.deviceId),
    activeIdx: index('license_activations_active_idx').on(table.isActive),
  };
});

/* Relations */

export const usersRelations = relations(users, ({ many }) => ({
  carts: many(carts),
  orders: many(orders),
  licenses: many(licenses),
  downloads: many(downloads),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  downloads: many(downloads),
  licenses: many(licenses),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const downloadsRelations = relations(downloads, ({ one, many }) => ({
  order: one(orders, {
    fields: [downloads.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [downloads.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [downloads.userId],
    references: [users.id],
  }),
  logs: many(downloadLogs),
}));

export const downloadLogsRelations = relations(downloadLogs, ({ one }) => ({
  download: one(downloads, {
    fields: [downloadLogs.downloadId],
    references: [downloads.id],
  }),
}));

export const licensesRelations = relations(licenses, ({ one, many }) => ({
  order: one(orders, {
    fields: [licenses.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [licenses.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [licenses.userId],
    references: [users.id],
  }),
  activations: many(licenseActivations),
}));

export const licenseActivationsRelations = relations(licenseActivations, ({ one }) => ({
  license: one(licenses, {
    fields: [licenseActivations.licenseId],
    references: [licenses.id],
  }),
}));
