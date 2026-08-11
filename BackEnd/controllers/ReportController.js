import { and, desc, eq, gte, lte } from "drizzle-orm"
import db from "../db/index.js"
import { Transactions, categoriesTable } from "../db/schema.js"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const monthIndex = (dt) => dt.getFullYear() * 12 + dt.getMonth()

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

export const getReport = async (req, res) => {
    try {
        const { from, to } = req.query

        const filters = [eq(Transactions.userId, req.user.id)]
        if (from) filters.push(gte(Transactions.Date1, from))
        if (to) filters.push(lte(Transactions.Date1, to))

        const rows = await db.select({
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
            .where(and(...filters))
            .orderBy(desc(Transactions.Date1))

        let totalIncome = 0
        let totalExpenses = 0
        const catMap = {}

        for (const row of rows) {
            const value = Number(row.amount)
            if (row.type === "Income") {
                totalIncome += value
            } else {
                totalExpenses += value
                const key = row.categoryId || "none"
                if (!catMap[key]) {
                    catMap[key] = {
                        name: row.categoryName || "Uncategorized",
                        color: row.categoryColor || "#64748b",
                        value: 0
                    }
                }
                catMap[key].value += value
            }
        }

        const end = to ? new Date(to) : new Date()
        const endMonth = new Date(end.getFullYear(), end.getMonth(), 1)
        const start = from ? new Date(from) : new Date(endMonth.getFullYear(), endMonth.getMonth() - 11, 1)
        const startMonth = new Date(start.getFullYear(), start.getMonth(), 1)

        const startIdx = monthIndex(startMonth)
        const len = monthIndex(endMonth) - startIdx + 1
        const monthly = Array.from({ length: len }, (_, i) => {
            const idx = startIdx + i
            return {
                label: `${MONTHS[idx % 12]} ${Math.floor(idx / 12)}`,
                Income: 0,
                Expense: 0
            }
        })

        for (const row of rows) {
            const idx = monthIndex(new Date(row.Date1)) - startIdx
            if (idx < 0 || idx >= len) continue
            const value = Number(row.amount)
            if (row.type === "Income") monthly[idx].Income += value
            else monthly[idx].Expense += value
        }

        const byCategory = Object.values(catMap).sort((a, b) => b.value - a.value)

        return res.json({
            success: true,
            report: {
                totalIncome,
                totalExpenses,
                balance: totalIncome - totalExpenses,
                count: rows.length,
                monthly,
                byCategory
            },
            transactions: rows.map(toApi)
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
