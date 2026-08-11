import express from "express"
import { AuthUser } from "../middleware/Authmid.js"
import {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory
} from "../controllers/CategoryController.js"

const CategoryRoute = express.Router()

CategoryRoute.use(AuthUser)

CategoryRoute.get("/", getCategories)
CategoryRoute.post("/", addCategory)
CategoryRoute.put("/:id", updateCategory)
CategoryRoute.delete("/:id", deleteCategory)

export default CategoryRoute
