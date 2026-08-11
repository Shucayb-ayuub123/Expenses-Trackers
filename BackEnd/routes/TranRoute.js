import express from "express"
import { AuthUser } from "../middleware/Authmid.js"
import {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionSummary
} from "../controllers/TranController.js"

const TranRoute = express.Router()

TranRoute.use(AuthUser)

TranRoute.get("/summary", getTransactionSummary)
TranRoute.get("/", getTransactions)
TranRoute.post("/", addTransaction)
TranRoute.put("/:id", updateTransaction)
TranRoute.delete("/:id", deleteTransaction)

export default TranRoute
