import { boolean, date, decimal, pgTable, serial, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

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

export const Transactions = pgTable("transaction", {
    id: uuid("id").defaultRandom().primaryKey(),
    description: text("description").notNull(),
    type: varchar("type", {
        length: 255
    }).notNull(),
    amount: decimal("amount").notNull(),
    Date1: timestamp("Date1").notNull()
})