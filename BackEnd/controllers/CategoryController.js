import { and, eq, sql } from "drizzle-orm"
import db from "../db/index.js"
import { categoriesTable, Transactions } from "../db/schema.js"

const toApi = (row) => ({
    id: row.id,
    name: row.name,
    color: row.color
})

export const getCategories = async (req, res) => {
    try {
        const rows = await db.select()
            .from(categoriesTable)
            .where(eq(categoriesTable.userId, req.user.id))
            .orderBy(categoriesTable.name)

        const counts = await db.select({
            categoryId: Transactions.categoryId,
            count: sql`count(*)::int`
        })
            .from(Transactions)
            .where(and(
                eq(Transactions.userId, req.user.id),
                sql`${Transactions.categoryId} is not null`
            ))
            .groupBy(Transactions.categoryId)

        const countMap = {}
        for (const c of counts) {
            countMap[c.categoryId] = c.count
        }

        return res.json({
            success: true,
            categories: rows.map((r) => ({
                ...toApi(r),
                transactionCount: countMap[r.id] || 0
            }))
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const addCategory = async (req, res) => {
    try {
        const { name, color } = req.body

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: "Category name is required" })
        }

        const [row] = await db.insert(categoriesTable).values({
            name: name.trim(),
            color: color || "#3b82f6",
            userId: req.user.id
        }).returning()

        return res.json({ success: true, category: { ...toApi(row), transactionCount: 0 } })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name, color } = req.body

        const [existing] = await db.select()
            .from(categoriesTable)
            .where(and(eq(categoriesTable.id, id), eq(categoriesTable.userId, req.user.id)))

        if (!existing) {
            return res.status(404).json({ success: false, message: "Category not found" })
        }

        const values = {}
        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({ success: false, message: "Category name is required" })
            }
            values.name = name.trim()
        }
        if (color !== undefined) values.color = color

        const [row] = await db.update(categoriesTable)
            .set(values)
            .where(and(eq(categoriesTable.id, id), eq(categoriesTable.userId, req.user.id)))
            .returning()

        return res.json({ success: true, category: toApi(row) })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        const [row] = await db.delete(categoriesTable)
            .where(and(eq(categoriesTable.id, id), eq(categoriesTable.userId, req.user.id)))
            .returning()

        if (!row) {
            return res.status(404).json({ success: false, message: "Category not found" })
        }

        return res.json({ success: true, message: "Category deleted" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
