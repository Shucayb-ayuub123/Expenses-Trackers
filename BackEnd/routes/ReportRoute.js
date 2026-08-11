import express from "express"
import { AuthUser } from "../middleware/Authmid.js"
import { getReport } from "../controllers/ReportController.js"

const ReportRoute = express.Router()

ReportRoute.use(AuthUser)

ReportRoute.get("/summary", getReport)

export default ReportRoute
