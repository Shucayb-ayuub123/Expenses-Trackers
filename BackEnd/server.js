import express from "express";
import cors from "cors";
import AuthRoute from "../BackEnd/routes/AuthRoute.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/", (req, res) => {
    res.send("API WORKING");
});

app.use("/api/Auth", AuthRoute);

app.listen(4000, () =>
    console.log("server running http://localhost:4000")
);