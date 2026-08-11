import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoute from "./routes/AuthRoute.js";
import TranRoute from "./routes/TranRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import ReportRoute from "./routes/ReportRoute.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://expenses-trackers-ten.vercel.app"
    ],
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("API WORKING");
});

app.use("/api/Auth", AuthRoute);
app.use("/transactions", TranRoute);
app.use("/categories", CategoryRoute);
app.use("/reports", ReportRoute);

app.listen(4000, () =>
    console.log("server running")
);
