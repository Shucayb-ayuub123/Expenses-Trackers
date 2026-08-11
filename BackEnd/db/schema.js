import { relations } from "drizzle-orm";
import { boolean, date, decimal, integer, pgTable, serial, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid("id")
        .defaultRandom()
        .primaryKey(),

    name: varchar("name", {
        length: 255
    }).notNull(),

    password: varchar("password", {
        length: 100
    }).notNull(),

    email: varchar("email", {
        length: 255
    })
        .notNull()
        .unique(),

    isVerified: boolean("isVerified").default(false).notNull(),

    verificationToken: varchar("verificationToken", {
        length: 255
    }),

    verificationTokenExpires: timestamp("verificationTokenExpires")

});

export const categoriesTable = pgTable("categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", {
        length: 100
    }).notNull(),
    color: varchar("color", {
        length: 50
    }).notNull().default("#3b82f6"),
    userId: uuid("userId").notNull().references(() => usersTable.id)
})

export const Transactions = pgTable("transaction", {
    id: uuid("id").defaultRandom().primaryKey(),
    description: text("description").notNull(),
    type: varchar("type", {
        length: 255
    }).notNull(),
    amount: decimal("amount").notNull(),
    Date1: date("Date1").notNull(),
    userId: uuid("userId").notNull().references(() => usersTable.id),
    categoryId: uuid("categoryId").references(() => categoriesTable.id, { onDelete: "set null" })
})


export const userRelation = relations(usersTable, ({ many }) => ({
    transactions: many(Transactions),
    categories: many(categoriesTable)
}))

export const categoryRelation = relations(categoriesTable, ({ one, many }) => ({
    users: one(usersTable, {
        fields: [categoriesTable.userId],
        references: [usersTable.id]
    }),
    transactions: many(Transactions)
}))

export const transactionRelation = relations(Transactions, ({ one }) => ({
    users: one(usersTable, {
        fields: [Transactions.userId],
        references: [usersTable.id]
    }),
    category: one(categoriesTable, {
        fields: [Transactions.categoryId],
        references: [categoriesTable.id]
    })
}))