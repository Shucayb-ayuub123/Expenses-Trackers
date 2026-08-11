import { and, desc, eq } from "drizzle-orm"
import db from "../db/index.js"
import { Transactions, categoriesTable } from "../db/schema.js"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const VALID_TYPES = ["Income", "Expense"]

const toApi = (row) => ({
    id: row.id,
    date: row.Date1,
    desc: row.description,
    type: row.type,
    amount: Number(row.amount),
    category: row.categoryId
        ? { id: row.categoryId, name: row.categoryName, color: row.categoryColor }
        : null
})

const baseSelect = db.select({
    id: Transactions.id,
    description: Transactions.description,
    type: Transactions.type,
    amount: Transactions.amount,
    Date1: Transactions.Date1,
    categoryId: Transactions.categoryId,
    categoryName: categoriesTable.name,
    categoryColor: categoriesTable.color
})
    .from(Transactions)
    .leftJoin(categoriesTable, eq(Transactions.categoryId, categoriesTable.id))

const validateCategory = async (categoryId, userId) => {
    if (!categoryId) return null

    const [cat] = await db.select({ id: categoriesTable.id })
        .from(categoriesTable)
        .where(and(
            eq(categoriesTable.id, categoryId),
            eq(categoriesTable.userId, userId)
        ))

    return cat || null
}

export const getTransactions = async (req, res) => {
    try {
        const rows = await baseSelect
            .where(eq(Transactions.userId, req.user.id))
            .orderBy(desc(Transactions.Date1))

        return res.json({
            success: true,
            transactions: rows.map(toApi)
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const addTransaction = async (req, res) => {
    try {
        const { desc, date, type, amount, categoryId } = req.body

        if (!desc || !date || !type || amount === undefined || amount === null || amount === "") {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        if (!VALID_TYPES.includes(type)) {
            return res.status(400).json({ success: false, message: "Type must be Income or Expense" })
        }

        const value = Number(amount)
        if (Number.isNaN(value) || value < 0) {
            return res.status(400).json({ success: false, message: "Amount must be a positive number" })
        }

        if (categoryId) {
            const cat = await validateCategory(categoryId, req.user.id)
            if (!cat) {
                return res.status(400).json({ success: false, message: "Invalid category" })
            }
        }

        const [row] = await db.insert(Transactions).values({
            description: desc,
            type,
            amount: String(value),
            Date1: date,
            userId: req.user.id,
            categoryId: categoryId || null
        }).returning()

        const [full] = await baseSelect.where(eq(Transactions.id, row.id))

        return res.json({ success: true, transaction: toApi(full) })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params
        const { desc, date, type, amount, categoryId } = req.body

        const [existing] = await db.select()
            .from(Transactions)
            .where(and(eq(Transactions.id, id), eq(Transactions.userId, req.user.id)))

        if (!existing) {
            return res.status(404).json({ success: false, message: "Transaction not found" })
        }

        const values = {}

        if (desc !== undefined) values.description = desc

        if (type !== undefined) {
            if (!VALID_TYPES.includes(type)) {
                return res.status(400).json({ success: false, message: "Type must be Income or Expense" })
            }
            values.type = type
        }

        if (amount !== undefined) {
            const value = Number(amount)
            if (Number.isNaN(value) || value < 0) {
                return res.status(400).json({ success: false, message: "Amount must be a positive number" })
            }
            values.amount = String(value)
        }

        if (date !== undefined) values.Date1 = date

        if (categoryId !== undefined) {
            if (categoryId) {
                const cat = await validateCategory(categoryId, req.user.id)
                if (!cat) {
                    return res.status(400).json({ success: false, message: "Invalid category" })
                }
                values.categoryId = categoryId
            } else {
                values.categoryId = null
            }
        }

        const [row] = await db.update(Transactions)
            .set(values)
            .where(and(eq(Transactions.id, id), eq(Transactions.userId, req.user.id)))
            .returning()

        const [full] = await baseSelect.where(eq(Transactions.id, row.id))

        return res.json({ success: true, transaction: toApi(full) })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params

        const [row] = await db.delete(Transactions)
            .where(and(eq(Transactions.id, id), eq(Transactions.userId, req.user.id)))
            .returning()

        if (!row) {
            return res.status(404).json({ success: false, message: "Transaction not found" })
        }

        return res.json({ success: true, message: "Transaction deleted" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getTransactionSummary = async (req, res) => {
    try {
        const rows = await db.select()
            .from(Transactions)
            .where(eq(Transactions.userId, req.user.id))

        let totalIncome = 0
        let totalExpenses = 0
        const monthly = MONTHS.map((month) => ({ month, Income: 0, Expense: 0 }))
        const currentYear = new Date().getFullYear()

        for (const row of rows) {
            const value = Number(row.amount)
            if (row.type === "Income") totalIncome += value
            else totalExpenses += value

            const d = new Date(row.Date1)
            if (d.getFullYear() === currentYear) {
                if (row.type === "Income") monthly[d.getMonth()].Income += value
                else monthly[d.getMonth()].Expense += value
            }
        }

        return res.json({
            success: true,
            summary: {
                totalIncome,
                totalExpenses,
                balance: totalIncome - totalExpenses,
                count: rows.length,
                monthly
            }
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
